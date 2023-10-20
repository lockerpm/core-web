import global from '../config/global'
import storeActions from '../store/actions'
import common from '../utils/common'

import syncServices from './sync'
import folderServices from './folder'
import sharingServices from './sharing'
import quickShareServices from './quick-share'

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
    const i = common.parseNotesOfNewTypes(item)
    i.checked = false
    return i
  })
  return result
}

async function clear_data() {
  global.store.dispatch(storeActions.updateAllCiphers([]))
  global.store.dispatch(storeActions.updateAllFolders([]))
  global.store.dispatch(storeActions.updateAllCollections([]))
  global.store.dispatch(storeActions.updateAllOrganizations([]))
  global.store.dispatch(storeActions.updateMyShares([]))
  global.store.dispatch(storeActions.updateInvitations([]))
}

async function sync_profile() {
  const profile = await syncServices.sync_profile();
  global.store.dispatch(storeActions.updateSyncProfile(profile));
  await global.jsCore.syncService.syncProfile({
    key: profile?.key,
    privateKey: profile?.privateKey,
    organizations: profile?.organizations,
    securityStamp: profile?.securityStamp || null,
    emailVerified: profile?.emailVerified || false
  })
  await get_all_organizations();
}

async function sync_folders() {
  const folders = await syncServices.sync_folders();
  const userId = await global.jsCore.userService.getUserId()
  await global.jsCore.syncService.syncFolders(userId, folders)
  await get_all_folders();
}

async function sync_collections() {
  const collections = await syncServices.sync_collections();
  await global.jsCore.syncService.syncCollections(collections);
  await get_all_collections();
}

async function sync_ciphers(response) {
  await global.jsCore.syncService.setLastSync(new Date())
  const userId = await global.jsCore.userService.getUserId()
  const decryptedCipherCache = global.jsCore.cipherService.decryptedCipherCache || []
  const deletedIds = []
  decryptedCipherCache.forEach(cipher => {
    if (response.ciphers.findIndex(c => c.id === cipher.id) < 0) {
      deletedIds.push(cipher.id)
    }
  })
  await Promise.all(deletedIds.map(async id => await global.jsCore.cipherService.delete(id)))
  await global.jsCore.syncService.syncSomeCiphers(userId, response.ciphers)
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
  const allCollections = result.filter(f => f.id)
  global.store.dispatch(storeActions.updateAllCollections(allCollections))
}

async function get_all_organizations() {
  const allOrganizations = await global.jsCore.userService.getAllOrganizations() || []
  global.store.dispatch(storeActions.updateAllOrganizations(allOrganizations))
}

async function sync_data(syncing = true) {
  clear_data();
  global.store.dispatch(storeActions.updateSyncing(syncing));
  await sync_profile();
  await Promise.all([
    sync_folders(),
    sync_collections(),
  ])
  const syncCount = await syncServices.sync_count();
  const size = 500;
  const maxCount = syncCount.count.ciphers || 0
  const request = []
  for (let page = 1; page <= Math.ceil(maxCount / size); page += 1) {
    request.push(syncServices.sync({ page, size }))
  }
  await Promise.all(request).then(async (result) => {
    const ciphers = result.map((r) => r.ciphers).flat();
    await sync_ciphers({ ...result[0], ciphers:ciphers })
  }).catch(() => {});
  global.store.dispatch(storeActions.updateSyncing(false))
}

async function get_quick_shares() {
  const userId = await global.jsCore.userService.getUserId();
  const quickShares = await quickShareServices.list();
  await global.jsCore.syncService.syncSends(userId, quickShares)
}

async function get_my_shares() {
  const myShares = await sharingServices.list_my_shares();
  await global.store.dispatch(storeActions.updateMyShares(myShares))
}

async function get_invitations() {
  const invitations = await sharingServices.list_invitations();
  await global.store.dispatch(storeActions.updateInvitations(invitations))
}

function password_strength(password) {
  return global.jsCore.passwordGenerationService.passwordStrength(password, [
    'cystack'
  ]) || { score: 0}
}

const sync_items = async (cipherIds) => {
  global.store.dispatch(storeActions.updateSyncing(true))
  const requests = cipherIds.map((id) => syncServices.sync_cipher(id))
  await Promise.all(requests).then(async (response) => {
    await global.jsCore.cipherService.upsert(response)
  })
  await get_all_ciphers();
  global.store.dispatch(storeActions.updateSyncing(false))
};

async function stop_sharing(cipher) {
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

async function delete_collection(collection) {
  const folderNameEnc = await global.jsCore.cryptoService.encrypt(collection.name)
  // Encrypt ciphers with self key
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

export default {
  clear_data,
  sync_data,
  sync_profile,
  sync_folders,
  sync_collections,
  sync_ciphers,
  get_all_ciphers,
  get_all_folders,
  get_all_collections,
  get_all_organizations,
  list_ciphers,
  get_quick_shares,
  get_my_shares,
  get_invitations,
  password_strength,
  sync_items,
  stop_sharing,
  stop_sharing_folder,
  delete_collection,
  delete_folder
}
