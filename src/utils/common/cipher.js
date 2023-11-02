import { CipherType, SecureNoteType } from '../../core-js/src/enums';
import { FieldType } from '../../core-js/src/enums/fieldType';
import { CipherRequest } from '../../core-js/src/models/request';
import { SecureNote } from '../../core-js/src/models/domain'
import { SendView } from '../../core-js/src/models/view/sendView';
import { Send } from '../../core-js/src/models/domain/send';
import { SendRequest } from '../../core-js/src/models/request/sendRequest';

import {
  CipherView,
  LoginView,
  IdentityView,
  CardView,
  LoginUriView,
  SecureNoteView,
} from '../../core-js/src/models/view';

import global from '../../config/global';
import cloneDeep from 'lodash/cloneDeep';
import newTypes from '../new-types';
import time from './time';

import { CryptoWalletData } from '../new-types/crypto-wallet';

import other from './other';

const newCipherTypes = [
  CipherType.TOTP,
  CipherType.CryptoWallet,
]

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
      firstName: cipher.identity?.firstName || '',
      lastName: cipher.identity?.lastName || ''
    }
  }
  return result
}

const convertFormToCipher = (form = {}, isNewCipher = true) => {
  let result = new CipherView();
  result.type = form.type;
  result.name = form.name;
  result.folderId = form.folderId || '',
  result.notes = form.notes || '',
  result.fields = form.fields?.map((f) => ({
    ...f,
    value: f.type === FieldType.Date ? time.convertDateTime(f.value, 'DD-MM-YYYY') : f.value
  })) || []
  if (form.type === CipherType.Login) {
    const loginUri = new LoginUriView()
    loginUri.uri = form.uri;
    result.login = {
      username: form.username,
      password: form.password,
      passwordRevisionDate: null,
      totp: form.totp || '',
      uris: [loginUri],
    }
  } else if (form.type === CipherType.CryptoWallet) {
    result.cryptoWallet = new CryptoWalletData({
      ...form,
      notes: form.notes,
      walletApp: other.selectedWalletApp(form.walletApp),
      networks: other.selectedNetworks(form.networks),
    })
  } else if (form.type === CipherType.Card) {
    result.card = {
      brand: other.cardBrandByNumber(form.number),
      cardholderName: form.cardholderName,
      code: form.code,
      expMonth: form.expMonth,
      expYear: form.expYear,
      number: form.number,
      response: null 
    }
  } else if (form.type === CipherType.Identity) {
    result.identity = {
      title: form.title,
      middleName: form.middleName,
      firstName: form.firstName,
      lastName: form.lastName,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      company: form.company,
      email: form.email,
      phone: form.phone,
      ssn: form.ssn,
      username: form.username,
      passportNumber: form.passportNumber,
      licenseNumber: form.licenseNumber,
    }
  }
  if (isNewCipher) {
    result.secureNote = new SecureNoteView()
    result.secureNote.type = SecureNoteType.Generic
  }
  return result
}

const getEncCipherForRequest = async (originalCipher, extraData = {}) => {
  const cipher = cloneDeep(originalCipher)
  // user cannot add item to shared folders, but can add item to their sharing folder
  // -> create new = only sharing folders; update = both sharing and shared folders
  const {
    writeableCollections,
    nonWriteableCollections,
    cloneMode,
    isNewCipher,
    noCheck, // Just need to get an encrypted item without checking collections, etc
    encKey // Encryption key
  } = extraData

  // Change type to Note for new cipher types to encrypt first
  if (cipher.type === CipherType.CryptoWallet) {
    if (cipher.cryptoWallet) {
      cipher.notes = JSON.stringify({
        ...cipher.cryptoWallet,
        notes: cipher.notes
      })
    }
  }
  if (newCipherTypes.includes(cipher.type)) {
    cipher.type = CipherType.SecureNote
    cipher.secureNote = new SecureNote(cipher.secureNote, true)
    cipher.secureNote.type = 0
  }
  // Check collections/folders validity
  if (!noCheck) {
    // Check if current folder is a collection (shared folder) or remove from old collection if move back to folder
    if (cipher.folderId) {
      const collections = isNewCipher
        ? writeableCollections
        : [...writeableCollections, ...nonWriteableCollections]
      const collection = collections.find(c => c.id === cipher.folderId)
      if (collection) {
        cipher.organizationId = collection.organizationId
        cipher.folderId = null
        cipher.collectionIds = [collection.id]
      } else {
        cipher.collectionIds = []

        // Remove org in clone mode
        if (cloneMode) {
          cipher.organizationId = null
        }
      }
    }

    // Remove orgId if item move out of collection to a folder or no folder
    if (cipher.organizationId) {
      const prevCollection = writeableCollections.find(
        c => c.organizationId === cipher.organizationId
      )
      if (
        prevCollection &&
        (cipher.folderId || !cipher.collectionIds.length)
      ) {
        cipher.organizationId = null
        cipher.collectionIds = []
      }
    }
  }

  // User can clone an item and add it to a shared folder
  // but they cannot add the item and share it at the same time
  if (cloneMode && cipher.organizationId && !cipher.collectionIds?.length) {
    cipher.organizationId = null
  }

  // Encrypt cipher
  const cipherEnc = await global.jsCore.cipherService.encrypt(cipher, encKey)
  const data = new CipherRequest(cipherEnc)

  // Change type back after encryption
  data.type = originalCipher.type
  cipher.type = originalCipher.type

  return {
    data,
    collectionIds: cipher.collectionIds
  }
}

const quickShareForRequest = async (data) => {
  const cipher = global.store.getState().cipher.allCiphers.find((c) => c.id === data.cipherId);
  const type_ = cipher.type
  if (newCipherTypes.includes(type_)) {
    cipher.type = CipherType.SecureNote
    cipher.secureNote.type = 0
  }
  const send = new Send()
  send.cipher = cipher
  send.cipherId = cipher.id
  send.password = ''
  send.maxAccessCount = data.countAccess ? data.maxAccessCount : null
  send.expirationDate = data.expireAfter ? new Date(Date.now() + data.expireAfter * 1000) : null
  send.requireOtp = !!data.requireOtp
  send.emails = data.requireOtp ? data.emails : []
  send.eachEmailAccessCount = null

  const sendView = new SendView(send)

  sendView.cipher = cipher
  const sendEnc = await global.jsCore.sendService.encrypt(sendView)
  const sendRequest = new SendRequest(sendEnc)
  sendRequest.cipher.type = type_
  cipher.type = type_
  return sendRequest
}

async function createEncryptedMasterPw (masterPw, encKey) {
  const cipher = new CipherView()
  cipher.type = CipherType.Login
  const loginData = new LoginView()
  loginData.username = 'locker.io'
  loginData.password = masterPw
  const uriView = new LoginUriView()
  uriView.uri = 'https://locker.io'
  loginData.uris = [uriView]
  cipher.login = loginData
  cipher.name = 'Locker Master Password'
  const cipherEnc = await global.jsCore.cipherService.encrypt(cipher, encKey)
  const data = new CipherRequest(cipherEnc)
  data.type = CipherType.MasterPassword
  return data
}

export default {
  newCipherTypes,
  cipherSubtitle,
  cipherTypeInfo,
  parseNotesOfNewTypes,
  convertCipherToForm,
  convertFormToCipher,
  getEncCipherForRequest,
  quickShareForRequest,
  createEncryptedMasterPw
}