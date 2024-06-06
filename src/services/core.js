import global from '../config/global';
import { ConstantsService } from '../core-js/src/services/constants.service';
import { SymmetricCryptoKey } from '../core-js/src/models/domain';
import { Utils } from '../core-js/src/misc/utils';

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

async function unlock(data) {
  if (global.jsCore) {
    await global.jsCore.cryptoService.clearKeys()
    let hashedPassword = data?.hashedPassword;
    let makeKey = data?.keyB64 ? new SymmetricCryptoKey(Utils.fromB64ToArray(data?.keyB64).buffer) : null
    if (data.password) {
      makeKey = await make_key(data.username, data.password)
      hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
    }
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
    await global.jsCore.cipherService.clear()
    await global.jsCore.searchService.clearIndex()
  }
}

async function logout () {
  if (global.jsCore) {
    await global.jsCore.cryptoService.clearKeys()
    await global.jsCore.userService.clear()
    await global.jsCore.cipherService.clear()
  }
}

export default {
  make_key,
  unlock,
  lock,
  logout,
}
