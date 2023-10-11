import store from "../../store";
import global from "../../config/global";
import { CipherType } from "../../core-js/src/enums";

const isProtectedCipher = (cipher) => {
  return cipher.type === CipherType.MasterPassword
}

const isOwner = (organizations, cipher) => {
  if (cipher.organizationId) {
    const team = organizations.find((o) => o.id === cipher.organizationId)
    if (team.type === global.constants.ACCOUNT_ROLE.OWNER) {
      return true
    }
    return false
  }
  return true
}

const isCipherShared = (organizationId) => {
  const share = store.myShares.find(s => s.id === organizationId) || {
    members: [],
    groups: []
  }
  return share?.members?.length || share?.groups?.length
}

const isCipherSharedWithMe = (organizationId, organizations) => {
  const team = organizations.find((o) => o.id === organizationId)
  return !!team
}

const isCipherShareable = (cipher, organizations) => {
  return (
    !cipher.isDeleted &&
    isOwner(organizations, cipher) &&
    !cipher.collectionIds.length &&
    !isProtectedCipher(cipher) &&
    cipher.type !== CipherType.TOTP
  )
}

const isCipherQuickShareable = (cipher) => {
  const isBelongToSelf =
    !cipher.organizationId ||
    !!store.myShares.find(i => i.organization_id === cipher.organizationId)
  return (
    !cipher.isDeleted &&
    !isProtectedCipher(cipher) &&
    cipher.type !== CipherType.TOTP &&
    isBelongToSelf &&
    !store.isOnPremise
  )
}

export default {
  isOwner,
  isCipherShared,
  isCipherSharedWithMe,
  isCipherShareable,
  isCipherQuickShareable
}