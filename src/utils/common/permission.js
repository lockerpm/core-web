import global from "../../config/global";
import { CipherType } from "../../core-js/src/enums";

const isProtectedCipher = (cipher) => {
  return cipher.type === CipherType.MasterPassword
}

const isOwner = (cipher) => {
  const organizations = global.store.getState().organization.allOrganizations;
  const organization = organizations.find((o) => o.id === cipher.organizationId)
  if (organization?.id) {
    return [global.constants.ACCOUNT_ROLE.OWNER].includes(organization.type)
  }
  return true
}

const isChangeCipher = (cipher) => {
  const organizations = global.store.getState().organization.allOrganizations;
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
  const share = global.store.getState().share.myShares.find(s => s.id === organizationId) || {
    members: [],
    groups: []
  }
  return share?.members?.length || share?.groups?.length
}

const isCipherSharedWithMe = (organizationId) => {
  const organizations = global.store.getState().organization.allOrganizations;
  const organization = organizations.find((o) => o.id === organizationId)
  return !!organization
}

const isCipherShareable = (cipher) => {
  return (
    !cipher.isDeleted &&
    isOwner(cipher) &&
    !cipher.collectionIds.length &&
    !isProtectedCipher(cipher) &&
    cipher.type !== CipherType.TOTP
  )
}

const isCipherQuickShareable = (cipher) => {
  const isBelongToSelf =
    !cipher.organizationId ||
    !!global.store.getState().share.myShares.find(i => i.organization_id === cipher.organizationId)
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