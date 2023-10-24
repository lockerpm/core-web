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
  return `${window.location.origin}/shares/${accessId}#${encodeURIComponent(
    key
  )}`
}

const generateMemberKey = async (publicKey, orgKey) => {
  const pk = Utils.fromB64ToArray(publicKey)
  const key = await global.jsCore.cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
  return key.encryptedString
}

export default {
  isExpired,
  getPublicShareUrl,
  generateMemberKey
}