import { CipherType } from '../../core-js/src/enums';
import global from '../../config/global';
import cloneDeep from 'lodash/cloneDeep';
import newTypes from '../new-types';

const cipherSubtitle = (item) => {
  if (!item) {
    return null
  }
  if (item.type === CipherType.CryptoWallet && item.cryptoWallet) {
    return item.cryptoWallet.username
  }
  return item.subTitle
}

const parseNotesOfNewTypes = (originalCipher) => {
  const cipher = cloneDeep(originalCipher)
  if (cipher.type === CipherType.CryptoWallet) {
    cipher['cryptoWallet'] = newTypes.cryptoWallet.toCryptoWalletData(cipher.notes)
  }
  return cipher
}

const cipherTypeInfo = (key = 'type', value) => {
  return global.constants.CIPHER_TYPES.find((t) => t[key] == value)
    || global.constants.CIPHER_TYPES[0]
}

export default {
  cipherSubtitle,
  cipherTypeInfo,
  parseNotesOfNewTypes
}