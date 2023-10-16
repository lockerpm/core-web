import { CipherType } from '../../core-js/src/enums';
import { FieldType } from '../../core-js/src/enums/fieldType';
import {
  CipherView,
  LoginView,
  IdentityView,
  CardView,
  LoginUriView,
} from '../../core-js/src/models/view';

import global from '../../config/global';
import cloneDeep from 'lodash/cloneDeep';
import newTypes from '../new-types';
import time from './time';

import { CryptoWalletData } from '../new-types/crypto-wallet';

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

const convertCipherToForm = (cipher = {}) => {
  let result = {
    type: cipher.type,
    name: cipher.name || '',
    fields: cipher.fields?.map((f) => ({
      ...f,
      value: f.type === FieldType.Date ? time.convertCipherFieldDate(f.value) : f.value
    })) || [],
    folderId: cipher.folderId || '',
    notes: cipher.notes || '',
  }
  if (cipher.type === CipherType.Login) {
    result = {
      ...result,
      ...(cipher.login || new LoginView()),
      uri: cipher?.login?.uris?.length > 0 ? cipher?.login?.uris[0]?.uri : '',
    }
  } else if (cipher.type === CipherType.CryptoWallet) {
    result = {
      ...result,
      ...cipher.cryptoWallet,
      walletApp: cipher.cryptoWallet?.walletApp?.alias || '',
      networks: cipher.cryptoWallet?.networks?.map((n) => n.alias) || [],
      notes: cipher.cryptoWallet?.notes || ''
    }
  } else if (cipher.type === CipherType.Card) {
    result = {
      ...result,
      ...(cipher.card || new CardView()),
    }
  } else if (cipher.type === CipherType.Identity) {
    result = {
      ...result,
      ...(cipher.identity || new IdentityView()),
      firstName: cipher.identity.firstName,
      lastName: cipher.identity.lastName
    }
  }
  return result
}

const convertFormToCipher = (form = {}) => {
  let result = new CipherView(form)
  if (form.type === CipherType.Login) {
    result = {
      ...result,
      login: new LoginView({
        ...form,
        uris: [new LoginUriView({ uri: form.uri })],
      })
    }
  } else if (cipher.type === CipherType.CryptoWallet) {
    result = {
      ...result,
      notes: JSON.stringify(new CryptoWalletData(form))
    }
  } else if (cipher.type === CipherType.Card) {
    result = {
      ...result,
      card: new CardView(form),
    }
  } else if (cipher.type === CipherType.Identity) {
    result = {
      ...result,
      card: new IdentityView(form),
    }
  }
  return result
}

export default {
  cipherSubtitle,
  cipherTypeInfo,
  parseNotesOfNewTypes,
  convertCipherToForm,
  convertFormToCipher,
}