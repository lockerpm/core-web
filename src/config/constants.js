import { Trans } from 'react-i18next'
import { CipherType } from '../core-js/src/enums'
import { FieldType } from '../core-js/src/enums/fieldType'

import keys from './keys'

const FILE_TYPE = {
  CSV: 'csv',
  JSON: 'json',
  ENCRYPTED_JSON: 'encrypted_json'
}

const ACCOUNT_ROLE = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
  MANAGER: 3
}

const PERMISSION = {
  EDIT: 'Edit',
  VIEW: 'View',
  ONLY_USE: 'Only Use'
}

const PERMISSION_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
}

const STATUS_ACTION = {
  ACCEPT: 'accept',
  REJECT: 'reject',
}

const STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACCEPTED: 'accepted',
  INVITED: 'invited',
  EXPIRED: 'expired',
  REJECT: 'rejected',
  SHARED: null
}

const MENU_TYPES = {
  CIPHERS: 'ciphers',
  FOLDERS: 'folders',
  QUICK_SHARES: 'quick-shares'
}

export default {
  FILE_TYPE,
  ACCOUNT_ROLE,
  PERMISSION,
  PERMISSION_ROLE,
  STATUS,
  STATUS_ACTION,
  MENU_TYPES,
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
  IMPORT_FILE_TYPES: [],
  EXPORT_FILE_TYPES: [
    {
      value: FILE_TYPE.CSV,
      icon: 'files/csv',
      label: 'CSV'
    },
    {
      value: FILE_TYPE.JSON,
      icon: 'files/json',
      label: 'JSON'
    },
    {
      value: FILE_TYPE.ENCRYPTED_JSON,
      icon: 'files/encrypted_json',
      label: 'ENCRYPTED_JSON'
    }
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
      key: 'password',
      type: CipherType.Login,
      icon: require('../assets/images/icons/ciphers/login.svg'),
      listRouter: keys.PASSWORDS,
      detailRouter: keys.PASSWORD_DETAIL,
      title: <Trans i18nKey={'sidebar.passwords'}/>,
      name: <Trans i18nKey={'cipher.types.password'}/>,
      isCreate: true,
    },
    {
      key: 'note',
      type: CipherType.SecureNote,
      icon: require('../assets/images/icons/ciphers/secure-note.svg'),
      listRouter: keys.NOTES,
      detailRouter: keys.NOTE_DETAIL,
      title: <Trans i18nKey={'sidebar.notes'}/>,
      name: <Trans i18nKey={'cipher.types.note'}/>,
      isCreate: true,
    },
    {
      key: 'card',
      type: CipherType.Card,
      icon: require('../assets/images/icons/ciphers/card.svg'),
      listRouter: keys.CARDS,
      detailRouter: keys.CARD_DETAIL,
      title: <Trans i18nKey={'sidebar.cards'}/>,
      name: <Trans i18nKey={'cipher.types.card'}/>,
      isCreate: true,
    },
    {
      key: 'crypto_backup',
      type: CipherType.CryptoWallet,
      icon: require('../assets/images/icons/ciphers/crypto-wallet.svg'),
      listRouter: keys.CRYPTO_BACKUPS,
      detailRouter: keys.CRYPTO_BACKUP_DETAIL,
      title: <Trans i18nKey={'sidebar.crypto_backups'}/>,
      name: <Trans i18nKey={'cipher.types.crypto_backup'}/>,
      isCreate: true,
    },
    {
      key: 'identity',
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
      name: <Trans i18nKey={'cipher.types.master_password'}/>,
      isCreate: false
    },
    {
      key: 'trash',
      type: null,
      icon: require('../assets/images/icons/ciphers/trash.svg'),
      listRouter: keys.TRASH,
      detailRouter: keys.VAULT_DETAIL,
      title: <Trans i18nKey={'sidebar.trash'}/>,
      name: <Trans i18nKey={'cipher.types.trash'}/>,
      isCreate: false,
      isDeleted: true
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
      icon: require('../assets/images/icons/wallet-apps/rice.png'),
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
  ],
  CARD_BRAND_OPTIONS: [
    { label: '----', value: '', icon: '' },
    { label: 'Visa', value: 'Visa' },
    { label: 'Mastercard', value: 'Mastercard' },
    { label: 'American Express', value: 'Amex' },
    { label: 'Discover', value: 'Discover' },
    { label: 'Diners Club', value: 'Diners Club' },
    { label: 'JCB', value: 'JCB' },
    { label: 'Maestro', value: 'Maestro' },
    { label: 'UnionPay', value: 'UnionPay' },
    { label: 'Other', value: 'Other' }
  ],
  EXP_MONTH_OPTIONS: [
    { label: '----', value: '' },
    { label: '01', value: '1' },
    { label: '02', value: '2' },
    { label: '03', value: '3' },
    { label: '04', value: '4' },
    { label: '05', value: '5' },
    { label: '06', value: '6' },
    { label: '07', value: '7' },
    { label: '08', value: '8' },
    { label: '09', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' }
  ],
  INVITATION_STATUSES: [
    {
      value: STATUS.PENDING,
      label: <Trans i18nKey={'statuses.pending'}/>,
      color: 'default'
    },
    {
      value: STATUS.CONFIRMED,
      label: <Trans i18nKey={'statuses.shared'}/>,
      color: 'success'
    },
    {
      value: STATUS.ACCEPTED,
      label: <Trans i18nKey={'statuses.accepted'}/>,
      color: 'processing'
    },
    {
      value: STATUS.INVITED,
      label: <Trans i18nKey={'statuses.invited'}/>,
      color: 'warning'
    },
    {
      value: STATUS.EXPIRED,
      label: <Trans i18nKey={'statuses.expired'}/>,
      color: 'error'
    },
    {
      value: STATUS.REJECT,
      label: <Trans i18nKey={'statuses.reject'}/>,
      color: 'error'
    },
    {
      value: STATUS.SHARED,
      label: <Trans i18nKey={'statuses.shared'}/>,
      color: 'success'
    },
  ],
  SHARE_PERMISSIONS: [
    {
      value: PERMISSION.EDIT,
      role: PERMISSION_ROLE.ADMIN,
      label: <Trans i18nKey={'permissions.editable'}/>,
    },
    {
      value: PERMISSION.VIEW,
      role: PERMISSION_ROLE.MEMBER,
      label: <Trans i18nKey={'permissions.viewable'}/>,
    },
  ],
  VAULT_TIMEOUTS: [
    {
      value: 1,
      label: <Trans i18nKey={'timeouts.one_minute'}/>,
    },
    {
      value: 5,
      label: <Trans i18nKey={'timeouts.five_minutes'}/>,
    },
    {
      value: 15,
      label: <Trans i18nKey={'timeouts.fifteen_minutes'}/>,
    },
    {
      value: 30,
      label: <Trans i18nKey={'timeouts.thirty_minutes'}/>,
    },
    {
      value: 60,
      label: <Trans i18nKey={'timeouts.one_hour'}/>,
    },
    {
      value: 60 * 4,
      label: <Trans i18nKey={'timeouts.four_hours'}/>,
    },
    {
      value: 60 * 24 * 14,
      label: <Trans i18nKey={'timeouts.two_weeks'}/>,
    },
    {
      value: -1,
      label: <Trans i18nKey={'timeouts.on_refresh'}/>,
    }
  ],
  VAULT_TIMEOUT_ACTIONS: [
    {
      value: 'lock',
      label: <Trans i18nKey={'button.lock'}/>,
    },
    {
      value: 'logOut',
      label: <Trans i18nKey={'button.logout'}/>,
    },
  ],
}
