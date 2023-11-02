import global from '../config/global';

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

export default {
  clear_keys,
  make_key,
  login_payload,
  auth_payload,
  unlock,
  lock,
  logout,
}
