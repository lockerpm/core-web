import { CipherType } from '../core-js/src/enums'
import global from '../config/global'

function convert_origin_item_to_cipher(item) {
  const cipherData = {
    id: item.id,
    name: item.name || null,
    organizationId: item.project_id || null,
    creationDate: item.creation_date || null,
    updatedDate: item.updated_date || null,
    revisionDate: item.creation_date || null,
    deletedDate: item.deleted_date || null,
    type: item.type
  }
  if (item.type === CipherType.Secret) {
    cipherData['secret'] = item.data
    cipherData['environmentId'] = item.environment_id
  } else if (item.type === CipherType.Environment) {
    cipherData['environment'] = {
      name: item.data.name,
      description: item.data.description,
      externalUrl: item.data.external_url
    }
  }
  return cipherData
}

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
    await global.jsCore.tokenService.setTokens(data.token, null)
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

async function sync_response(response) {
  try {
    const { secrets, environments } = response
    await global.jsCore.syncService.setLastSync(new Date())
    const userId = await global.jsCore.userService.getUserId()
    const allCiphers = [
      ...secrets.map(s => ({ ...s, type: CipherType.Secret })),
      ...environments.map(s => ({ ...s, type: CipherType.Environment }))
    ].map(c => convert_origin_item_to_cipher(c))
  
    const decryptedCipherCache = global.jsCore.cipherService.decryptedCipherCache || []
    const deletedIds = []
    decryptedCipherCache.forEach(cipher => {
      if (allCiphers.findIndex(c => c.id === cipher.id) < 0) {
        deletedIds.push(cipher.id)
      }
    })
    await Promise.all(deletedIds.map(async id => await global.jsCore.cipherService.delete(id)))
    await global.jsCore.syncService.syncSomeCiphers(userId, allCiphers)
  } catch (error) {
    console.log(error)
  }
}

export default {
  convert_origin_item_to_cipher,
  clear_keys,
  make_key,
  login_payload,
  auth_payload,
  unlock,
  lock,
  logout,
  sync_response
}
