import global from '../config/global'
import storeActions from '../store/actions'
import common from '../utils/common'

import userServices from './user'
import authServices from './auth'
import syncServices from './sync'
import folderServices from './folder'
import sharingServices from './sharing'
import quickShareServices from './quick-share'
import resourceServices from './resource'
import cipherServices from './cipher'

async function init_server() {
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

async function sync_data(syncing = true) {
  let result = false;
  global.store.dispatch(storeActions.updateSyncing(syncing));
  const syncCount = await syncServices.sync_count();
  const size = 500;
  const maxCount = syncCount.count.ciphers || 0
  const requests = []
  for (let page = 1; page <= (Math.ceil(maxCount / size) || 1); page += 1) {
    requests.push(syncServices.sync({ page, size }))
  }
  await Promise.all(requests).then(async (responses) => {
    const { profile, collections, policies, folders, domains } = responses[0]
    const ciphers = responses.map((r) => r.ciphers).flat();
    await common.syncProfile(profile);
    await Promise.all([
      common.syncFolders(folders),
      common.syncCollections(collections),
      common.syncPolicies(policies),
      common.syncCiphers(ciphers),
      common.syncSettings(domains)
    ])
    Promise.all([
      common.getMyShares(),
      common.getInvitations(),
      common.getTeams(),
      common.getQuickShares()
    ])
    result = true;
  }).catch((error) => {
    global.pushError(error);
    result = false;
  });
  global.store.dispatch(storeActions.updateSyncing(false));
  return result;
}

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
  await common.getQuickShares();
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
  await sharingServices.delete_sharing_folder(collection.organizationId, collection.id, payload);
  await global.jsCore.cipherService.softDelete(cipherInsideCollection.map((c) => c.id));
  await common.getAllCollections();
}

async function delete_folder(folder) {
  const cipherInsideFolder = global.store.getState().cipher.allCiphers.filter(c => c.folderId === folder.id)
  await folderServices.remove(folder.id)
  await global.jsCore.cipherService.softDelete(cipherInsideFolder.map((c) => c.id));
  await common.getAllFolders();
}

async function leave_share(item) {
  await sharingServices.leave_share(item.organizationId || item?.team?.id)
  if (item.ciphers) {
    await global.jsCore.cipherService.delete(item.ciphers.map(c => c.id))
    await global.jsCore.collectionService.delete(item.id)
  } else {
    await global.jsCore.cipherService.delete([item.id])
  }
  await common.getAllCiphers();
}

async function reset_service() {
  if (global.store.getState().service.isConnected) {
    await service.resetBackgroundService();
  }
}

async function remove_from_collection(cipher) {
  const personalKey = await global.jsCore.cryptoService.getEncKey()
  if (cipher.collectionIds?.length) {
    const { data } = await common.getEncCipherForRequest(cipher, {
      noCheck: true,
      encKey: personalKey
    })
    await sharingServices.update_sharing_folder_items(
      cipher.organizationId,
      cipher.collectionIds[0],
      { cipher: { ...data, id: cipher.id }}
    )
  }
}

async function before_delete_ciphers(ciphers) {
  const folderCiphers = ciphers.filter((c) => c.folderId);
  const collectionCiphers = ciphers.filter((c) => c.collectionIds?.length > 0);

  if (folderCiphers.length > 0) {
    await cipherServices.move({ ids: folderCiphers.map((c) => c.id), folderId: null })
  }

  if (collectionCiphers.length > 0) {
    const requests = collectionCiphers.map((cipher) => remove_from_collection(cipher));
    await Promise.all(requests);
  }

  const sharingCiphers = ciphers.filter((c) => c.organizationId).map((cipher) => ({ ...cipher, folderId: null, collectionIds: null }));
  if (sharingCiphers.length > 0) {
    const requests = sharingCiphers.map((cipher) => stop_sharing_cipher(cipher));
    await Promise.all(requests);
  }
}

export default {
  init_server,
  sync_data,
  stop_sharing_cipher,
  stop_sharing_folder,
  stop_quick_share,
  delete_collection,
  delete_folder,
  leave_share,
  reset_service,
  remove_from_collection,
  before_delete_ciphers,
}
