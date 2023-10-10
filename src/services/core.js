import global from '../config/global'
import store from '../store'
import storeActions from '../store/actions'
import syncServices from './sync'
import orderBy from 'lodash/orderBy'

async function clear_keys() {
  await global.jsCore.cryptoService.clearKeys()
}

async function make_key(username, password) {
  if (global.jsCore) {
    return await global.jsCore.cryptoService.makeKey(
      password,
      username,
      0,
      100000
    )
  }
  return ''
}

async function login_payload(data) {
  const makeKey = await make_key(data.username, data.password)
  const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
  return {
    username: data.username,
    password: hashedPassword,
  }
}

async function auth_payload(data, isRegister = true) {
  if (global.jsCore) {
    const makeKey = await make_key(data.username, data.password)
    const encKey = await global.jsCore.cryptoService.makeEncKey(makeKey)
    const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])
    const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
    let payload = {
      username: data.username,
      password: hashedPassword,
      key: encKey[1].encryptedString,
      public_key: keys[0],
      private_key: keys[1].encryptedString,
    }
    if (isRegister) {
      const hashedConfirmPassword = await global.jsCore.cryptoService.hashPassword(data.confirm_password, makeKey)
      payload = {
        ...payload,
        confirm_password: hashedConfirmPassword
      }
    }
    return payload
  }
  return data
}

async function unlock(data) {
  if (global.jsCore) {
    await clear_keys()
    const makeKey = await make_key(data.username, data.password)
    const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
    await global.jsCore.tokenService.setTokens(data.access_token, null)
    await global.jsCore.userService.setInformation(
      global.jsCore.tokenService.getUserId(),
      data.username,
      0,
      100000
    )
    await global.jsCore.cryptoService.setKey(makeKey)
    await global.jsCore.cryptoService.setKeyHash(hashedPassword)
    await global.jsCore.cryptoService.setEncKey(data.key)
    await global.jsCore.cryptoService.setEncPrivateKey(data.private_key)
  }
}

async function lock () {
  if (global.jsCore) {
    await Promise.all([
      global.jsCore.cryptoService.clearKey(),
      global.jsCore.cryptoService.clearOrgKeys(true),
      global.jsCore.cryptoService.clearKeyPair(true),
      global.jsCore.cryptoService.clearEncKey(true)
    ])
  
    global.jsCore.cipherService.clearCache()
    global.jsCore.searchService.clearIndex()
  }
}

async function logout () {
  if (global.jsCore) {
    await clear_keys()
    await global.jsCore.userService.clear()
  }
}

async function sync_data() {
  store.dispatch(storeActions.updateSyncing(true));
  const syncCount = await syncServices.sync_count();
  const size = 500;
  const maxCount = syncCount.count.ciphers || 0
  const request = []
  for (let page = 1; page <= Math.ceil(maxCount / size); page += 1) {
    request.push(syncServices.sync({ page, size }))
  }
  await Promise.all(request).then(async (result) => {
    await sync_profile(result[0].profile)
    await sync_ciphers({
      ...result[0],
      ciphers: result.map((r) => r.ciphers).flat()
    })
  }).catch(() => {
  });
  store.dispatch(storeActions.updateSyncing(false))
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

async function sync_ciphers(response) {
  try {
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
    const allCiphers = await global.jsCore.cipherService.getAllDecrypted()
    store.dispatch(storeActions.updateAllCiphers(allCiphers))
  } catch (error) {
    console.log(error)
  }
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
  if (params.orderField && params.orderDirection) {
    result = orderBy(
      result,
      [
        c =>
          params.orderField === 'name'
            ? c.name && c.name.toLowerCase()
            : c.revisionDate
      ],
      [
        params.orderDirection
      ]
    ) || []
  }
  return result
}

export default {
  clear_keys,
  make_key,
  login_payload,
  auth_payload,
  unlock,
  lock,
  logout,
  sync_data,
  sync_profile,
  sync_ciphers,
  list_ciphers
}
