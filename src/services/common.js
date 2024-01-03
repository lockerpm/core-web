import global from '../config/global'
import storeActions from '../store/actions'
import common from '../utils/common'

import coreServices from './core'
import userServices from './user'
import authServices from './auth'
import syncServices from './sync'
import folderServices from './folder'
import sharingServices from './sharing'
import quickShareServices from './quick-share'
import enterpriseServices from './enterprise'
import systemServices from './system'
import resourceServices from './resource'

import i18n from '../config/i18n'

const init_server = async () => {
  const currentPage = common.getRouterByLocation(global.location)
  if (currentPage?.type === 'public') {
    return
  }
  global.store.dispatch(storeActions.toggleLoading(true))
  const serverType = await resourceServices.get_server_type();
  global.store.dispatch(storeActions.updateServerType(serverType.server_type))
  const checkExist = await userServices.check_exist();
  const exist = checkExist?.exist || false
  if (exist) {
    await authServices.redirect_login();
  } else {
    global.navigate(global.keys.SIGN_UP)
  }
  global.store.dispatch(storeActions.toggleLoading(false))
}

const fetch_user_info = async () => {
  await userServices.users_me().then(async (response) => {
    await global.jsCore.vaultTimeoutService.setVaultTimeoutOptions(response.timeout, response.timeout_action);
    global.store.dispatch(storeActions.updateUserInfo(response));
    global.store.dispatch(storeActions.changeLanguage(response.language || global.constants.LANGUAGE.EN));
    systemServices.update_language(response.language || global.constants.LANGUAGE.EN);
    i18n.changeLanguage(response.language || global.constants.LANGUAGE.EN);
  }).catch(async () => {
    await authServices.logout();
  })
}

async function list_ciphers(params, ciphers = null) {
  let result = await global.jsCore.searchService.searchCiphers(
    params.searchText,
    [
      ...params.filters,
      c => c.isDeleted === params.deleted,
    ],
    ciphers
  ) || []
  result = result.map(item => {
    return common.parseNotesOfNewTypes(item)
  })
  return result
}

async function clear_data() {
  await Promise.all([
    global.jsCore.cipherService.clear(),
    global.jsCore.folderService.clear(),
    global.jsCore.collectionService.clear(),
    global.jsCore.sendService.clear()
  ])
  global.store.dispatch(storeActions.updateAllCiphers([]))
  global.store.dispatch(storeActions.updateAllFolders([]))
  global.store.dispatch(storeActions.updateAllCollections([]))
  global.store.dispatch(storeActions.updateAllOrganizations([]))
  global.store.dispatch(storeActions.updateMyShares([]))
  global.store.dispatch(storeActions.updateInvitations([]))
  global.store.dispatch(storeActions.updateSends([]))
}

async function sync_profile(data) {
  let profile = data
  if (!profile) {
    profile = await syncServices.sync_profile();
    global.store.dispatch(storeActions.updateSyncProfile(profile));
  }
  await global.jsCore.syncService.syncProfile({
    key: profile?.key,
    privateKey: profile?.privateKey,
    organizations: profile?.organizations,
    securityStamp: profile?.securityStamp || null,
    emailVerified: profile?.emailVerified || false
  })
  await get_all_organizations();
}

async function sync_folders(data) {
  let folders = data
  if (!folders) {
    folders = await syncServices.sync_folders();
  }
  const userId = await global.jsCore.userService.getUserId()
  await global.jsCore.syncService.syncFolders(userId, folders)
  await get_all_folders();
}

async function sync_collections(data) {
  let collections = data
  if (!collections) {
    collections = await syncServices.sync_collections();
  }
  await global.jsCore.syncService.syncCollections(collections);
  await get_all_collections();
}

async function sync_policies(data) {
  let policies = data
  if (!policies) {
    policies = await syncServices.sync_policies();
  }
  await global.jsCore.syncService.syncPolicies(policies);
}

async function sync_settings(domains) {
  const userId = await global.jsCore.userService.getUserId()
  global.jsCore.syncService.syncSettings(userId, domains)
}

async function sync_ciphers(ciphers) {
  await global.jsCore.syncService.setLastSync(new Date())
  const userId = await global.jsCore.userService.getUserId()
  const decryptedCipherCache = global.jsCore.cipherService.decryptedCipherCache || []
  const deletedIds = []
  decryptedCipherCache.forEach(cipher => {
    if (ciphers.findIndex(c => c.id === cipher.id) < 0) {
      deletedIds.push(cipher.id)
    }
  })
  await Promise.all(deletedIds.map(async id => await global.jsCore.cipherService.delete(id)))
  await global.jsCore.syncService.syncSomeCiphers(userId, ciphers)
  await get_all_ciphers();
}

async function get_all_ciphers() {
  const result = await global.jsCore.cipherService.getAllDecrypted() || []
  const allCiphers = result.map(item => {
    const i = common.parseNotesOfNewTypes(item)
    i.checked = false
    return i
  })
  global.store.dispatch(storeActions.updateAllCiphers(allCiphers))
}

async function get_all_folders() {
  const result = await global.jsCore.folderService.getAllDecrypted() || []
  const allFolders = result.filter(f => f.id)
  global.store.dispatch(storeActions.updateAllFolders(allFolders))
}

async function get_all_collections() {
  const result = await global.jsCore.collectionService.getAllDecrypted() || []
  const allCollections = result.filter(f => f.id).map((c) => ({ ...c, isCollection: true }))
  global.store.dispatch(storeActions.updateAllCollections(allCollections))
}

async function get_all_organizations() {
  const allOrganizations = await global.jsCore.userService.getAllOrganizations() || []
  global.store.dispatch(storeActions.updateAllOrganizations(allOrganizations))
}

async function get_sends() {
  const sends = await global.jsCore.sendService.getAllDecrypted() || []
  const allCiphers = global.store.getState().cipher.allCiphers
  global.store.dispatch(storeActions.updateSends(sends.map((s) => {
    const cipher = allCiphers.find(c => c.id === s.cipherId)
    return { ...s, name: cipher?.name, cipher }
  })))
}

async function get_quick_shares() {
  const userId = await global.jsCore.userService.getUserId();
  const quickShares = await quickShareServices.list();
  await global.jsCore.syncService.syncSends(userId, quickShares);
  await get_sends()
}

async function get_my_shares() {
  const myShares = await sharingServices.list_my_shares();
  await global.store.dispatch(storeActions.updateMyShares(myShares))
}

async function get_invitations() {
  const invitations = await sharingServices.list_invitations();
  await global.store.dispatch(storeActions.updateInvitations(invitations))
}

async function get_teams() {
  const teams = await enterpriseServices.list_teams({ paging: 0 });
  await global.store.dispatch(storeActions.updateTeams(teams))
}

async function sync_data(syncing = true) {
  global.store.dispatch(storeActions.updateSyncing(syncing));
  const syncCount = await syncServices.sync_count();
  const size = 500;
  const maxCount = syncCount.count.ciphers || 0
  const request = []
  for (let page = 1; page <= (Math.ceil(maxCount / size) || 1); page += 1) {
    request.push(syncServices.sync({ page, size }))
  }
  await Promise.all(request).then(async (result) => {
    const { profile, collections, policies, folders, domains } = result[0]
    const ciphers = result.map((r) => r.ciphers).flat();
    await sync_profile(profile);
    await Promise.all([
      sync_folders(folders),
      sync_collections(collections),
      sync_policies(policies),
      sync_ciphers(ciphers),
      sync_settings(domains)
    ])
    await Promise.all([
      get_my_shares(),
      get_invitations(),
      get_teams(),
      get_quick_shares()
    ])
  }).catch((error) => {
    console.log(error);
  });
  global.store.dispatch(storeActions.updateSyncing(false))
}

function password_strength(password) {
  return global.jsCore.passwordGenerationService.passwordStrength(password, [
    'cystack'
  ]) || { score: 0 }
}

const sync_items = async (cipherIds) => {
  global.store.dispatch(storeActions.updateSyncing(true))
  const requests = cipherIds.map((id) => syncServices.sync_cipher(id))
  await Promise.all(requests).then(async (response) => {
    await global.jsCore.cipherService.upsert(response)
  }).catch(() => {
  })
  await get_all_ciphers();
  global.store.dispatch(storeActions.updateSyncing(false))
};

async function stop_sharing_cipher(cipher) {
  let memberId = null
  if (cipher.user) {
    memberId = cipher.user.id
    delete cipher.user
  }
  const { data } = await common.getEncCipherForRequest(cipher, {
    noCheck: true,
    encKey: await global.jsCore.cryptoService.getEncKey()
  })

  if (memberId) {
    await sharingServices.stop_sharing_member(
      cipher.organizationId,
      memberId,
      {
        folder: null,
        cipher: { ...data, id: cipher.id }
      }
    )
  } else {
    await sharingServices.stop_sharing(
      cipher.organizationId,
      {
        folder: null,
        cipher: { ...data, id: cipher.id }
      }
    )
  }
}

async function stop_sharing_folder(folder) {
  let memberId = null
  if (folder.user) {
    memberId = folder.user.id
    delete folder.user
  }
  const folderNameEnc = await global.jsCore.cryptoService.encrypt(folder.name)

  // Encrypt ciphers with self key
  const personalKey = await global.jsCore.cryptoService.getEncKey()
  const cipherInsideFolder = global.store.getState().cipher.allCiphers.filter(c => c.collectionIds.includes(folder.id))
  const ciphers = await Promise.all(
    cipherInsideFolder.map(async cipher => {
      const { data } = await common.getEncCipherForRequest(cipher, {
        noCheck: true,
        encKey: personalKey
      })
      return {
        id: cipher.id,
        ...data,
        creationDate: cipher.creationDate
      }
    })
  )

  const payload = {
    folder: {
      id: folder.id,
      name: folderNameEnc.encryptedString,
      ciphers
    }
  }

  if (memberId) {
    await sharingServices.stop_sharing_member(
      folder.organizationId,
      memberId,
      payload
    )
  } else {
    await sharingServices.stop_sharing(
      folder.organizationId,
      payload
    )
  }
}

async function stop_quick_share(send) {
  await quickShareServices.stop(send.id).then(async () => {
    await global.jsCore.sendService.delete([send.id])
  })
  await get_quick_shares();
}

async function delete_collection(collection) {
  const folderNameEnc = await global.jsCore.cryptoService.encrypt(collection.name)
  const personalKey = await global.jsCore.cryptoService.getEncKey()
  const cipherInsideCollection = global.store.getState().cipher.allCiphers.filter(c => c.collectionIds.includes(collection.id))
  const ciphers = await Promise.all(
    cipherInsideCollection.map(async cipher => {
      const { data } = await common.getEncCipherForRequest(cipher, {
        noCheck: true,
        encKey: personalKey
      })
      return {
        id: cipher.id,
        ...data
      }
    })
  )
  const payload = {
    folder: {
      id: collection.id,
      name: folderNameEnc.encryptedString,
      ciphers
    }
  }
  await sharingServices.delete_sharing_folder(folder.organizationId, folder.id, payload);
  await global.jsCore.cipherService.softDelete(cipherInsideCollection.map((c) => c.id));
  await get_all_collections();
}

async function delete_folder(folder) {
  const cipherInsideFolder = global.store.getState().cipher.allCiphers.filter(c => c.folderId === folder.id)
  await folderServices.remove(folder.id)
  await global.jsCore.cipherService.softDelete(cipherInsideFolder.map((c) => c.id));
  await get_all_folders();
}

async function leave_share(item) {
  await sharingServices.leave_share(item.organizationId || item?.team?.id)
  if (item.ciphers) {
    await global.jsCore.cipherService.delete(item.ciphers.map(c => c.id))
    await global.jsCore.collectionService.delete(item.id)
  } else {
    await global.jsCore.cipherService.delete([item.id])
  }
  await get_all_ciphers();
}

async function sync_data_by_ws(message) {
  const eventType = message.type;
  global.store.dispatch(storeActions.updateSyncing(true))
  if (['cipher_share', 'collection_update', 'cipher_invitation'].includes(eventType)) {
    await sync_data();
  } else if (eventType.includes('cipher')) {
    if (['cipher_update', 'cipher_delete', 'cipher_restore'].includes(eventType)) {
      if (eventType === 'cipher_update') {
        await sync_profile();
      }
      if (message.data.id) {
        await sync_items([message.data.id])
      }
      if (message.data.ids) {
        await sync_items(message.data.ids)
      }
    } else if (eventType.includes('cipher_delete_permanent')) {
      await global.jsCore.cipherService.delete(message.data.ids);
      await get_all_ciphers();
    } else {
      await sync_data();
    }
  } else if (eventType.includes('folder')) {
    if (eventType.includes('update')) {
      const res = await syncServices.sync_folder(message.data.id);
      await global.jsCore.folderService.upsert([res])
      await get_all_folders();
    } else if (eventType.includes('delete')) {
      await global.jsCore.folderService.delete(message.data.ids);
      await get_all_folders();
    } else {
      await sync_data();
    }
  } else if (eventType.includes('collection')) {
    if (eventType.includes('update')) {
      if (message.data.id) {
        const res = await syncServices.sync_collection(message.data.id);
        await global.jsCore.collectionService.upsert([res])
        await get_all_collections();
      }
    } else if (eventType.includes('delete')) {
      await global.jsCore.collectionService.delete(message.data.ids);
      await get_all_collections();
    } else {
      await sync_data();
    }
  }
  global.store.dispatch(storeActions.updateSyncing(false))
}

async function unlock_to_vault(payload, query = null, callback = () => { }) {
  const request =  payload?.is_otp ? userServices.users_session_otp(payload) : userServices.users_session(payload)
  delete payload.is_otp
  await request.then(async (response) => {
    if (response.is_factor2) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.OTP_CODE, {}, query || {})
    } else if (!response.is_factor2 && response.token) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.SETUP_2FA, {}, query || {})
    } else {
      authServices.update_access_token_type(response.token_type)
      authServices.update_access_token(response.access_token);
      authServices.update_unlock_method(payload.unlock_method)
      await fetch_user_info();
      await coreServices.unlock({ ...response, ...payload });
      await sync_data();
      if (payload.sync_all_platforms) {
        await service_login(payload);
      }
      if (query) {
        callback();
      } else {
        global.navigate(global.keys.VAULT);
      }
    }
  }).catch((error) => {
    global.pushError(error)
  })
}

async function reset_service() {
  if (global.store.getState().service.isConnected) {
    await service.resetBackgroundService();
  }
}

async function service_login(data) {
  if (global.store.getState().service.isConnected && (service.pairingService?.hasKey || global.store.getState().system.isDesktop)) {
    let hashedPassword = data?.hashedPassword
    let key = data?.keyB64
    if (data.password) {
      const makeKey = await coreServices.make_key(data.email, data.password)
      hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
      key = makeKey.keyB64
    }
    await service.login({
      email: data.email,
      key: key,
      hashedPassword: hashedPassword
    })
  }
}

async function service_logout() {
  if (global.store.getState().service.isConnected) {
    await service.setCacheData(null);
  }
  if (global.store.getState().service.isConnected && (service.pairingService?.hasKey || global.store.getState().system.isDesktop)) {
    await service.logout();
  }
}

export default {
  init_server,
  fetch_user_info,
  clear_data,
  sync_data,
  sync_profile,
  sync_folders,
  sync_collections,
  sync_policies,
  sync_ciphers,
  sync_settings,
  get_all_ciphers,
  get_all_folders,
  get_all_collections,
  get_all_organizations,
  list_ciphers,
  get_quick_shares,
  get_my_shares,
  get_invitations,
  get_teams,
  password_strength,
  sync_items,
  stop_sharing_cipher,
  stop_sharing_folder,
  stop_quick_share,
  delete_collection,
  delete_folder,
  leave_share,
  get_sends,
  sync_data_by_ws,
  unlock_to_vault,
  reset_service,
  service_login,
  service_logout
}
