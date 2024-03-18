import global from '../../config/global'
import storeActions from '../../store/actions'

import syncServices from '../../services/sync'
import quickShareServices from '../../services/quick-share'

import common from '.'

const syncProfile = async (data) => {
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
  await common.getAllCollections();
}

const syncFolders = async (data) => {
  let folders = data
  if (!folders) {
    folders = await syncServices.sync_folders();
  }
  const userId = await global.jsCore.userService.getUserId()
  await global.jsCore.syncService.syncFolders(userId, folders)
  await common.getAllFolders();
}

const syncCollections = async (data) => {
  let collections = data
  if (!collections) {
    collections = await syncServices.sync_collections();
  }
  await global.jsCore.syncService.syncCollections(collections);
  await common.getAllCiphers();
}

const syncPolicies = async (data) => {
  let policies = data
  if (!policies) {
    policies = await syncServices.sync_policies();
  }
  await global.jsCore.syncService.syncPolicies(policies);
}

const syncSettings = async(domains) => {
  const userId = await global.jsCore.userService.getUserId()
  global.jsCore.syncService.syncSettings(userId, domains)
}

const syncCiphers = async(ciphers) => {
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
  await common.getAllCiphers();
}

const getQuickShares = async () => {
  const userId = await global.jsCore.userService.getUserId();
  const quickShares = await quickShareServices.list();
  await global.jsCore.syncService.syncSends(userId, quickShares);
  await common.getSends()
}

const syncItems = async (cipherIds) => {
  global.store.dispatch(storeActions.updateSyncing(true))
  const requests = cipherIds.map((id) => syncServices.sync_cipher(id))
  await Promise.all(requests).then(async (response) => {
    await global.jsCore.cipherService.upsert(response)
  }).catch(() => {
  })
  await common.getAllCiphers();
  global.store.dispatch(storeActions.updateSyncing(false))
};

export default {
  syncProfile,
  syncFolders,
  syncCollections,
  syncPolicies,
  syncSettings,
  syncCiphers,
  getQuickShares,
  syncItems
}