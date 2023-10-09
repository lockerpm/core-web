import userServices from './user'
import coreServices from './core'
import syncServices from './sync'

import store from '../store'
import storeActions from '../store/actions'
import global from '../config/global'

async function sync_profile() {
  const { profile } = await syncServices.sync_profile_data();
  store.dispatch(storeActions.updateUserInfo(profile));
  await global.jsCore.syncService.syncProfile({
    key: profile?.key,
    privateKey: profile?.privateKey,
    organizations: profile?.projects,
    securityStamp: profile?.securityStamp || null,
    emailVerified: profile?.emailVerified || false
  })
}

async function sync_ciphers() {
  store.dispatch(storeActions.updateSyncing(true));
  const statistic = await syncServices.sync_statistic();
  const size = 100;
  const maxCount = statistic?.count.secrets > statistic?.count.environments ? statistic?.count.secrets : statistic?.count.environments
  const request = []
  for (let page = 1; page <= Math.ceil(maxCount / size); page += 1) {
    request.push(syncServices.sync({ page, size }))
  }
  const result = await Promise.all(request);
  await coreServices.sync_response({
    ...result[0],
    secrets: result.map((s) => s.secrets).flat(),
    environments: result.map((s) => s.environments).flat(),
  })
  store.dispatch(storeActions.updateSyncing(false))
}

export default {
  sync_profile,
  sync_ciphers,
}