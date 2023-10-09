import authServices from './auth'
import userServices from './user'
import coreServices from './core'
import syncServices from './sync'

import store from '../store'
import storeActions from '../store/actions'
import global from '../config/global'

async function update_auth_info(data, isUnlock = true) {
  authServices.update_access_token(data.token)
  authServices.update_access_token_type(data.token_type)
  userServices.update_account_info({
    username: data.username,
    full_name: data.full_name,
  })
  if (isUnlock) {
    await coreServices.unlock(data)
  }
}

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

async function fetch_data(callback = () => {}) {
  const requests = [
    userServices.factor2(),
  ]
  await Promise.all(requests).then(async ([
    factor2,
  ]) => {
    store.dispatch(storeActions.updateFactor2(factor2))
  })
}

export default {
  update_auth_info,
  sync_profile,
  sync_ciphers,
  fetch_data
}