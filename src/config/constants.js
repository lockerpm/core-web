import { Trans } from 'react-i18next'
import { CipherType } from '../core-js/src/enums'
import { FieldType } from '../core-js/src/enums/fieldType'

import keys from './keys'

const FILE_TYPE = {
  JSON: 'json',
}

const ACCOUNT_ROLE = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
  MANAGER: 3
}

export default {
  FILE_TYPE,
  ACCOUNT_ROLE,
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
      key: 'vault',
      type: null,
      icon: require('../assets/images/icons/ciphers/vault.svg'),
      listRouter: keys.VAULT,
      detailRouter: keys.VAULT_DETAIL,
      title: <Trans i18nKey={'inventory.all_items'}/>,
      name: <></>,
      isCreate: false
    },
    {
      key: 'passwords',
      type: CipherType.Login,
      icon: require('../assets/images/icons/ciphers/login.svg'),
      listRouter: keys.PASSWORDS,
      detailRouter: keys.PASSWORD_DETAIL,
      title: <Trans i18nKey={'sidebar.passwords'}/>,
      name: <Trans i18nKey={'cipher.types.password'}/>,
      isCreate: true,
    },
    {
      key: 'notes',
      type: CipherType.SecureNote,
      icon: require('../assets/images/icons/ciphers/secure-note.svg'),
      listRouter: keys.NOTES,
      detailRouter: keys.NOTE_DETAIL,
      title: <Trans i18nKey={'sidebar.notes'}/>,
      name: <Trans i18nKey={'cipher.types.note'}/>,
      isCreate: true,
    },
    {
      key: 'cards',
      type: CipherType.Card,
      icon: require('../assets/images/icons/ciphers/card.svg'),
      listRouter: keys.CARDS,
      detailRouter: keys.CARD_DETAIL,
      title: <Trans i18nKey={'sidebar.cards'}/>,
      name: <Trans i18nKey={'cipher.types.card'}/>,
      isCreate: true,
    },
    {
      key: 'crypto_backups',
      type: CipherType.CryptoWallet,
      icon: require('../assets/images/icons/ciphers/crypto-wallet.svg'),
      listRouter: keys.CRYPTO_BACKUPS,
      detailRouter: keys.CRYPTO_BACKUP_DETAIL,
      title: <Trans i18nKey={'sidebar.crypto_backups'}/>,
      name: <Trans i18nKey={'cipher.types.crypto_backup'}/>,
      isCreate: true,
    },
    {
      key: 'identities',
      type: CipherType.Identity,
      icon: require('../assets/images/icons/ciphers/identity.svg'),
      listRouter: keys.IDENTITIES,
      detailRouter: keys.IDENTITY_DETAIL,
      title: <Trans i18nKey={'sidebar.identities'}/>,
      name: <Trans i18nKey={'cipher.types.identity'}/>,
      isCreate: true,
    },
    {
      key: 'authenticator',
      type: CipherType.TOTP,
      icon: require('../assets/images/icons/ciphers/authenticator.svg'),
      listRouter: keys.AUTHENTICATOR,
      title: <Trans i18nKey={'sidebar.authenticator'}/>,
      isCreate: false
    },
    {
      key: 'master_password',
      type: CipherType.MasterPassword,
      icon: require('../assets/images/icons/ciphers/login.svg'),
      listRouter: keys.VAULT,
      detailRouter: keys.VAULT_DETAIL,
      title: <Trans i18nKey={''}/>,
      isCreate: false
    }
  ],
  WALLET_APPS: [
    {
      name: 'Coinbase',
      alias: 'coinbase',
      icon: require('../assets/images/icons/wallet-apps/coinbase.jpeg'),
    },
    {
      name: 'Binance',
      alias: 'bsc',
      icon: require('../assets/images/icons/wallet-apps/binance.webp'),
    },
    {
      name: 'Metamask',
      alias: 'metamask',
      icon: require('../assets/images/icons/wallet-apps/metamask.webp'),
    },
    {
      name: 'Huobi',
      alias: 'huobi',
      icon: require('../assets/images/icons/wallet-apps/huobi.webp'),
    },
    {
      name: 'Exodus',
      alias: 'exodus',
      icon: require('../assets/images/icons/wallet-apps/exodus.webp'),
    },
    {
      name: 'Crypto.com DeFi Wallet',
      alias: 'cryptocom',
      icon: require('../assets/images/icons/wallet-apps/cryptocom.webp'),
    },
    {
      name: 'RICE Wallet',
      alias: 'rice',
      icon: require('../assets/images/icons/wallet-apps/rice.webp'),
    },
    {
      name: 'Coin98',
      alias: 'coin98',
      icon: require('../assets/images/icons/wallet-apps/coin98.webp'),
    },
    {
      name: 'Trust Wallet',
      alias: 'trustwallet',
      icon: require('../assets/images/icons/wallet-apps/trustwallet.webp'),
    },
    {
      name: 'Other',
      alias: 'other',
      icon: require('../assets/images/icons/wallet-apps/crypto-wallet.png'),
    }
  ],
  CHAINS: [
    {
      name: 'Bitcoin',
      alias: 'bitcoin',
      logo: require('../assets/images/icons/chains/bitcoin.png')
    },
    {
      name: 'Binance Smart Chain',
      alias: 'bsc',
      logo: require('../assets/images/icons/chains/bsc.png')
    },
    {
      name: 'Ethereum',
      alias: 'ethereum',
      logo: require('../assets/images/icons/chains/ethereum.png')
    },
    {
      name: 'Polygon',
      alias: 'polygon',
      logo: require('../assets/images/icons/chains/polygon.png')
    },
    {
      name: 'Avalanche',
      alias: 'avalanche',
      logo: require('../assets/images/icons/chains/avalanche.png')
    },
    {
      name: 'Solana',
      alias: 'solana',
      logo: require('../assets/images/icons/chains/solana.png')
    },
    {
      name: 'Polkadot',
      alias: 'polkadot',
      logo: require('../assets/images/icons/chains/polkadot.png')
    },
    {
      name: 'Cosmos',
      alias: 'cosmos',
      logo: require('../assets/images/icons/chains/cosmos.png')
    },
    {
      name: 'Metadium',
      alias: 'metadium',
      logo: require('../assets/images/icons/chains/metadium.png')
    },
    {
      name: 'Cronos',
      alias: 'cronos',
      logo: require('../assets/images/icons/chains/cronos.png')
    },
    {
      name: 'Shibachain',
      alias: 'shibachain',
      logo: require('../assets/images/icons/chains/shibachain.png')
    },
    {
      name: 'XRP Ledger',
      alias: 'xrpl',
      logo: require('../assets/images/icons/chains/xrpl.png')
    },
    {
      name: 'Cardano',
      alias: 'cardano',
      logo: require('../assets/images/icons/chains/cardano.png')
    },
    {
      name: 'Hedera',
      alias: 'hedera',
      logo: require('../assets/images/icons/chains/hedera.png')
    },
    {
      name: 'Tezos',
      alias: 'tezos',
      logo: require('../assets/images/icons/chains/tezos.png')
    },
    {
      name: 'Boba',
      alias: 'boba',
      logo: require('../assets/images/icons/chains/boba.png')
    },
    {
      name: 'Tomochain',
      alias: 'tomochain',
      logo: require('../assets/images/icons/chains/tomochain.png')
    },
    {
      name: 'Gnosis',
      alias: 'gnosis',
      logo: require('../assets/images/icons/chains/gnosis.png')
    },
    {
      name: 'Other',
      alias: 'other',
      logo: require('../assets/images/icons/chains/other.png')
    }
  ],
  SORT_OPTIONS: [
    {
      key: 'name_ascending',
      orderField: 'name',
      orderDirection: 'asc',
      label: <Trans i18nKey={'sort_options.name_ascending'}/>,
    },
    {
      key: 'name_descending',
      orderField: 'name',
      orderDirection: 'desc',
      label: <Trans i18nKey={'sort_options.name_descending'}/>,
    },
    {
      key: 'time_ascending',
      orderField: 'revisionDate',
      orderDirection: 'asc',
      label: <Trans i18nKey={'sort_options.time_ascending'}/>,
    },
    {
      key: 'time_descending',
      orderField: 'revisionDate',
      orderDirection: 'desc',
      label: <Trans i18nKey={'sort_options.time_descending'}/>,
    }
  ],
  FIELD_TYPES: [
    {
      key: 'text',
      value: FieldType.Text,
      fieldPlaceholder: 'field_name',
    },
    {
      key: 'hidden_field',
      value: FieldType.Hidden,
      fieldPlaceholder: 'field_name',
      placeholder: 'text'
    },
    {
      key: 'url',
      value: FieldType.Url,
      defaultValue: 'https://',
      pattern: 'URL'
    },
    {
      key: 'email',
      value: FieldType.Email,
      pattern: 'EMAIL'
    },
    {
      key: 'date',
      value: FieldType.Date,
    },
    {
      key: 'month_year',
      value: FieldType.MonthYear,
      pattern: 'MONTH_YEAR'
    },
    {
      key: 'phone',
      value: FieldType.Phone,
      pattern: 'PHONE'
    }
  ]
}
