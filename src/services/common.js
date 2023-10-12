import global from '../config/global'
import store from '../store'
import storeActions from '../store/actions'
import common from '../utils/common'

import syncServices from './sync'
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
  store.dispatch(storeActions.updateAllCiphers([]))
  store.dispatch(storeActions.updateAllFolders([]))
  store.dispatch(storeActions.updateAllCollections([]))
  store.dispatch(storeActions.updateAllOrganizations([]))
  store.dispatch(storeActions.updateMyShares([]))
  store.dispatch(storeActions.updateInvitations([]))
}

async function sync_profile(profile) {
  store.dispatch(storeActions.updateSyncProfile(profile));
  await global.jsCore.syncService.syncProfile({
    key: profile?.key,
    privateKey: profile?.privateKey,
    organizations: profile?.organizations,
    securityStamp: profile?.securityStamp || null,
    emailVerified: profile?.emailVerified || false
  })
}

async function sync_folders(folders) {
  const userId = await global.jsCore.userService.getUserId()
  await global.jsCore.syncService.syncFolders(userId, folders)
}

async function sync_collections(collections) {
  await global.jsCore.syncService.syncCollections(collections)
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
}

async function get_all_ciphers() {
  const result = await global.jsCore.cipherService.getAllDecrypted() || []
  const allCiphers = result.map(item => {
    const i = common.parseNotesOfNewTypes(item)
    i.checked = false
    return i
  })
  store.dispatch(storeActions.updateAllCiphers(allCiphers))
}

async function get_all_folders() {
  const result = await global.jsCore.folderService.getAllDecrypted() || []
  const allFolders = result.filter(f => f.id)
  store.dispatch(storeActions.updateAllFolders(allFolders))
}

async function get_all_collections() {
  const result = await global.jsCore.collectionService.getAllDecrypted() || []
  const allCollections = result.filter(f => f.id)
  store.dispatch(storeActions.updateAllCollections(allCollections))
}

async function get_all_organizations() {
  const allOrganizations = await global.jsCore.userService.getAllOrganizations() || []
  store.dispatch(storeActions.updateAllOrganizations(allOrganizations))
}

async function sync_data() {
  clear_data();
  store.dispatch(storeActions.updateSyncing(true));
  const syncCount = await syncServices.sync_count();
  const size = 500;
  const maxCount = syncCount.count.ciphers || 0
  const request = []
  for (let page = 1; page <= Math.ceil(maxCount / size); page += 1) {
    request.push(syncServices.sync({ page, size }))
  }
  await Promise.all(request).then(async (result) => {
    const ciphers = result.map((r) => r.ciphers).flat();
    await sync_profile(result[0].profile)
    await sync_folders(result[0].folders)
    await sync_collections(result[0].collections)
    await sync_ciphers({ ...result[0], ciphers:ciphers })
    await get_all_ciphers();
    await get_all_folders();
    await get_all_collections();
    await get_all_organizations();
  }).catch(() => {
  });
  store.dispatch(storeActions.updateSyncing(false))
}

async function get_quick_shares() {
  const userId = await global.jsCore.userService.getUserId();
  const quickShares = await quickShareServices.list();
  await global.jsCore.syncService.syncSends(userId, quickShares)
}

async function get_my_shares() {
  const myShares = await sharingServices.list_my_shares();
  await store.dispatch(storeActions.updateMyShares(myShares))
}

async function get_invitations() {
  const invitations = await sharingServices.list_invitations();
  await store.dispatch(storeActions.updateInvitations(invitations))
}

export default {
  clear_data,
  sync_data,
  sync_profile,
  sync_ciphers,
  get_all_ciphers,
  get_all_folders,
  get_all_collections,
  get_all_organizations,
  list_ciphers,
  get_quick_shares,
  get_my_shares,
  get_invitations,
}
