import global from '../config/global';
import { ConstantsService } from '../core-js/src/services/constants.service';

async function clear_keys() {
  await global.jsCore.cryptoService.clearKeys()
}

async function make_key(username, password) {
  if (global.jsCore) {
    return await global.jsCore.cryptoService.makeKey(
      password,
      username,
      global.constants.CORE_JS_INFO.KDF,
      global.constants.CORE_JS_INFO.KDF_ITERATIONS
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

async function unlock(data) {
  if (global.jsCore) {
    await clear_keys()
    const makeKey = await make_key(data.username, data.password)
    const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
    await global.jsCore.tokenService.setTokens(data.access_token, null)
    await global.jsCore.userService.setInformation(
      global.jsCore.tokenService.getUserId(),
      data.username,
      global.constants.CORE_JS_INFO.KDF,
      global.constants.CORE_JS_INFO.KDF_ITERATIONS
    )
    await global.jsCore.cryptoService.setKey(makeKey)
    await global.jsCore.cryptoService.setKeyHash(hashedPassword)
    await global.jsCore.cryptoService.setEncKey(data.key)
    await global.jsCore.cryptoService.setEncPrivateKey(data.private_key)
    await global.jsCore.storageService.save(ConstantsService.lastActiveKey, new Date().getTime())
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

export default {
  clear_keys,
  make_key,
  login_payload,
  unlock,
  lock,
  logout,
}
