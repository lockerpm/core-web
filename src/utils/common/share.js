import { Utils } from "../../core-js/src/misc/utils";

import global from "../../config/global";

const isExpired = (send) => {
  const expired = send.expirationDate && send.expirationDate <= new Date()
  const maxAccessReached =
    send.maxAccessCount && send.accessCount >= send.maxAccessCount
  return expired || maxAccessReached
}

const getPublicShareUrl = (send) => {
  const accessId = send.accessId;
  const key = Utils.fromBufferToUrlB64(send.key)
  return `${window.location.origin}/quick-shares/${accessId}#${encodeURIComponent(
    key
  )}`
}

async function generateAccessKey (publicKey) {
  const pk = Utils.fromB64ToArray(publicKey)
  const encKey = await global.jsCore.cryptoService.getEncKey()
  const key = await global.jsCore.cryptoService.rsaEncrypt(encKey.key, pk.buffer)
  return key.encryptedString
}

const clientGenerateMemberKey = async (publicKey, orgKey) => {
  const pk = Utils.fromB64ToArray(publicKey)
  const key = await global.jsCore.cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
  return key.encryptedString
}


export default {
  isExpired,
  getPublicShareUrl,
  generateAccessKey,
  clientGenerateMemberKey
}