import global from "../../config/global";
import { CipherType } from "../../core-js/src/enums";
import store from "../../store";

const isProtectedCipher = (cipher) => {
  return cipher.type === CipherType.MasterPassword
}

const isOwner = (organizations, cipher) => {
  const organization = organizations.find((o) => o.id === cipher.organizationId)
  if (organization?.id) {
    return [
      global.constants.ACCOUNT_ROLE.OWNER,
    ].includes(organization.type)
  }
  return true
}

const isChangeCipher = (organizations, cipher) => {
  const organization = organizations.find((o) => o.id === cipher.organizationId)
  if (organization?.id) {
    return [
      global.constants.ACCOUNT_ROLE.OWNER,
      global.constants.ACCOUNT_ROLE.ADMIN
    ].includes(organization.type)
  }
  return true
}

const isCipherShared = (organizationId) => {
  const share = store.getState().share.myShares.find(s => s.id === organizationId) || {
    members: [],
    groups: []
  }
  return share?.members?.length || share?.groups?.length
}

const isCipherSharedWithMe = (organizations, organizationId) => {
  const organization = organizations.find((o) => o.id === organizationId)
  return !!organization
}

const isCipherShareable = (organizations, cipher) => {
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
    !!store.getState().share.myShares.find(i => i.organization_id === cipher.organizationId)
  return (
    cipher.type !== CipherType.TOTP &&
    !cipher.isDeleted &&
    !isProtectedCipher(cipher) &&
    isBelongToSelf
  )
}

export default {
  isOwner,
  isChangeCipher,
  isCipherShared,
  isCipherSharedWithMe,
  isCipherShareable,
  isCipherQuickShareable
}