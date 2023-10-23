import { Utils } from "../../core-js/src/misc/utils"

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

export default {
  isExpired,
  getPublicShareUrl
}