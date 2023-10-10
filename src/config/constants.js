import { Trans } from 'react-i18next'
import { CipherType } from '../core-js/src/enums'

import keys from './keys'

const FILE_TYPE = {
  JSON: 'json',
}

export default {
  FILE_TYPE,
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  SERVICE_SCOPE: 'secret',
  CLIENT_ID: 'web',
  PAGE_SIZE: 50,
  LANGUAGES: [
    {
      value: 'en',
      label: <Trans i18nKey='common.english' />,
    },
    {
      value: 'vi',
      label: <Trans i18nKey='common.vietnamese' />,
    },
  ],
  IMPORT_EXPORT_FILE_TYPES: [
    {
      value: FILE_TYPE.JSON,
      label: 'Json'
    }
  ],
  SMTP_PROVIDERS: [
    {
      name: 'Other SMTP provider',
      host: '',
      port: ''
    },
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: '587'
    },
    {
      name: 'Microsoft Outlook',
      host: 'smtp.office365.com',
      port: '587'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: '587'
    },
    {
      name: 'Mailtrap Email Sending',
      host: 'live.smtp.mailtrap.io',
      port: '587'
    },
    {
      name: 'Mailgun',
      host: 'mtp.mailgun.org',
      port: '587'
    },
    {
      name: 'Apple mail',
      host: 'smtp.mail.me.com',
      port: '587'
    },
    {
      name: 'Mandrill',
      host: 'smtp.mandrillapp.com',
      port: '587'
    },
    {
      name: 'SparkPost',
      host: 'mtp.sparkpostmail.com',
      port: '587'
    },
    {
      name: 'Postmark',
      host: 'smtp.postmarkapp.com',
      port: '587'
    },
  ],
  CIPHER_TYPES: [
    {
      type: null,
      icon: 'vault',
      listRouter: keys.VAULT,
      detailRouter: keys.VAULT_DETAIL,
      title: <Trans i18nKey={'vault.all_items'}/>
    },
    {
      type: CipherType.Login,
      icon: 'login',
      listRouter: keys.PASSWORDS,
      detailRouter: keys.PASSWORD_DETAIL,
      title: <Trans i18nKey={'sidebar.passwords'}/>
    },
    {
      type: CipherType.SecureNote,
      icon: 'secure-note',
      listRouter: keys.NOTES,
      detailRouter: keys.NOTE_DETAIL,
      title: <Trans i18nKey={'sidebar.notes'}/>
    },
    {
      type: CipherType.Card,
      icon: 'card',
      listRouter: keys.CARDS,
      detailRouter: keys.CARD_DETAIL,
      title: <Trans i18nKey={'sidebar.cards'}/>
    },
    {
      type: CipherType.CryptoWallet,
      icon: 'crypto-wallet',
      listRouter: keys.CRYPTO_BACKUPS,
      detailRouter: keys.CRYPTO_BACKUP_DETAIL,
      title: <Trans i18nKey={'sidebar.crypto_backups'}/>
    },
    {
      type: CipherType.Identity,
      icon: 'identity',
      listRouter: keys.IDENTITIES,
      detailRouter: keys.IDENTITY_DETAIL,
      title: <Trans i18nKey={'sidebar.identities'}/>
    }
  ]
}
