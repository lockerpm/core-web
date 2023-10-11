import { CipherType } from '../../core-js/src/enums';
import global from '../../config/global';

const cipherSubtitle = (item) => {
  if (!item) {
    return null
  }
  if (item.type === CipherType.CryptoWallet && item.cryptoWallet) {
    return item.cryptoWallet.username
  }
  if (item.type === CipherType.DriverLicense && item.driverLicense) {
    return item.driverLicense.fullName
  }
  if (item.type === CipherType.CitizenID && item.citizenId) {
    return item.citizenId.fullName
  }
  if (item.type === CipherType.Passport && item.passport) {
    return item.passport.fullName
  }
  if (item.type === CipherType.SocialSecurityNumber && item.ssn) {
    return item.ssn.fullName
  }
  if (item.type === CipherType.WirelessRouter && item.router) {
    return item.router.deviceName
  }
  if (item.type === CipherType.Server && item.server) {
    return item.server.username
  }
  return item.subTitle
}

const cipherTypeInfo = (key = 'type', value) => {
  return global.constants.CIPHER_TYPES.find((t) => t[key] == value)
    || global.constants.CIPHER_TYPES[0]
}

export default {
  cipherSubtitle,
  cipherTypeInfo
}