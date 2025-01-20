import React from 'react'
import { CipherType } from '../core-js/src/enums'
import { FieldType } from '../core-js/src/enums/fieldType'

import {
  DesktopOutlined,
  MobileOutlined,
  GlobalOutlined,
  ChromeOutlined
} from "@ant-design/icons";

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
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  ACCEPTED: 'accepted',
  ACCESSED: 'accessed',
  INVITED: 'invited',
  EXPIRED: 'expired',
  REJECT: 'rejected',
  REQUESTED: 'requested',
  RECOVERY_INITIATED: 'recovery_initiated',
  RECOVERY_APPROVED: 'recovery_approved',
  SHARED: null
}

const MENU_TYPES = {
  CIPHERS: 'ciphers',
  FOLDERS: 'folders',
  QUICK_SHARES: 'quick-shares'
}

const ACCESS_TYPE = {
  VIEW: 'view',
  TAKEOVER: 'takeover',
}

const LANGUAGE = {
  VI: 'vi',
  EN: 'en',
  ZH: 'zh',
  RU: 'ru'
}

const NOTIFICATION_TYPE = {
  ITEM_SHARING: 'item_sharing',
  MEMBER_TO_GROUP_SHARE: 'member_to_group_share',
  EMERGENCY_ACCESS: 'emergency_access',
  DATA_BREACH: 'data_breach',
  PASSWORD_TIP_TRICK: 'password_tip_trick',
  MARKETING: 'marketing'
}

const USER_TYPE = {
  PERSONAL: 'personal',
  ENTERPRISE: 'enterprise',
}

const SERVER_TYPE = {
  PERSONAL: 'personal',
  ENTERPRISE: 'enterprise',
}

const FACTOR2_IDENTITY = {
  MAIL: 'mail',
  SMART_OTP: 'smart_otp',
}

const ACTIVITY_LOG_ACTION = {
  MEMBER_CHANGES: 'member_changes',
  ROLE_CHANGES: 'role_changes',
  POLICY_CHANGES: 'policy_violations',
  USER_LOGIN: 'user_login',
  SHARE: 'share'
}

const USER_ROLE = {
  PRIMARY_ADMIN: 'primary_admin',
  ADMIN: 'admin',
  MEMBER: 'member',
}

const TIMEOUT_ACTION = {
  LOCK: 'lock',
  LOGOUT: 'logOut'
}

export default {
  FILE_TYPE,
  ACCOUNT_ROLE,
  PERMISSION,
  PERMISSION_ROLE,
  STATUS,
  STATUS_ACTION,
  MENU_TYPES,
  ACCESS_TYPE,
  NOTIFICATION_TYPE,
  LANGUAGE,
  USER_TYPE,
  SERVER_TYPE,
  FACTOR2_IDENTITY,
  CLIENT_ID: 'web',
  PAGE_SIZE: 50,
  MAX_KEY_BACKUP: 3,
  ACTIVITY_LOG_ACTION,
  USER_ROLE,
  TIMEOUT_ACTION,
  MAX_TABLE_WIDTH: 748,
  CORE_JS_INFO: {
    KDF: 0,
    KDF_ITERATIONS: 100000
  },
  LANGUAGES: [
    {
      value: LANGUAGE.EN,
      label: 'common.english',
    },
    {
      value: LANGUAGE.VI,
      label: 'common.vietnamese',
    },
    {
      value: LANGUAGE.ZH,
      label: 'common.chinese',
    },
    {
      value: LANGUAGE.RU,
      label: 'common.russian',
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
      historyRouter: keys.VAULT_HISTORY,
      title: 'inventory.all_items',
      name: '',
      isCreate: false
    },
    {
      key: 'password',
      type: CipherType.Login,
      icon: require('../assets/images/icons/ciphers/login.svg'),
      listRouter: keys.PASSWORDS,
      detailRouter: keys.PASSWORD_DETAIL,
      historyRouter: keys.PASSWORD_HISTORY,
      title: 'sidebar.passwords',
      name: 'cipher.types.password',
      isCreate: true,
    },
    {
      key: 'note',
      type: CipherType.SecureNote,
      icon: require('../assets/images/icons/ciphers/secure-note.svg'),
      listRouter: keys.NOTES,
      detailRouter: keys.NOTE_DETAIL,
      title: 'sidebar.notes',
      name: 'cipher.types.note',
      isCreate: true,
    },
    {
      key: 'card',
      type: CipherType.Card,
      icon: require('../assets/images/icons/ciphers/card.svg'),
      listRouter: keys.CARDS,
      detailRouter: keys.CARD_DETAIL,
      title: 'sidebar.cards',
      name: 'cipher.types.card',
      isCreate: true,
    },
    {
      key: 'crypto_backup',
      type: CipherType.CryptoWallet,
      icon: require('../assets/images/icons/ciphers/crypto-wallet.svg'),
      listRouter: keys.CRYPTO_BACKUPS,
      detailRouter: keys.CRYPTO_BACKUP_DETAIL,
      title: 'sidebar.crypto_backups',
      name: 'cipher.types.crypto_backup',
      isCreate: true,
    },
    {
      key: 'identity',
      type: CipherType.Identity,
      icon: require('../assets/images/icons/ciphers/identity.svg'),
      listRouter: keys.IDENTITIES,
      detailRouter: keys.IDENTITY_DETAIL,
      title: 'sidebar.identities',
      name: 'cipher.types.identity',
      isCreate: true,
    },
    {
      key: 'authenticator',
      type: CipherType.TOTP,
      icon: require('../assets/images/icons/ciphers/authenticator.svg'),
      listRouter: keys.AUTHENTICATOR,
      title: 'sidebar.authenticator',
      isCreate: false
    },
    {
      key: 'master_password',
      type: CipherType.MasterPassword,
      icon: require('../assets/images/logos/icon-logo.svg'),
      listRouter: keys.VAULT,
      detailRouter: keys.VAULT_DETAIL,
      title: '',
      name: 'cipher.types.master_password',
      isCreate: false
    },
    {
      key: 'trash',
      type: null,
      icon: require('../assets/images/icons/ciphers/trash.svg'),
      listRouter: keys.TRASH,
      detailRouter: keys.TRASH_DETAIL,
      title: 'sidebar.trash',
      name: 'cipher.types.trash',
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
      label: 'sort_options.name_ascending',
    },
    {
      key: 'name_descending',
      orderField: 'name',
      orderDirection: 'desc',
      label: 'sort_options.name_descending',
    },
    {
      key: 'time_ascending',
      orderField: 'revisionDate',
      orderDirection: 'asc',
      label: 'sort_options.time_ascending',
    },
    {
      key: 'time_descending',
      orderField: 'revisionDate',
      orderDirection: 'desc',
      label: 'sort_options.time_descending',
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
  STATUSES: [
    {
      value: STATUS.PENDING,
      label: 'statuses.pending',
      color: 'default'
    },
    {
      value: STATUS.CREATED,
      label: 'statuses.created',
      color: 'default'
    },
    {
      value: STATUS.CONFIRMED,
      label: 'statuses.confirmed',
      color: 'success'
    },
    {
      value: STATUS.ACCESSED,
      label: 'statuses.accessed',
      color: 'success'
    },
    {
      value: STATUS.ACCEPTED,
      label: 'statuses.accepted',
      color: 'processing'
    },
    {
      value: STATUS.INVITED,
      label: 'statuses.invited',
      color: 'warning'
    },
    {
      value: STATUS.EXPIRED,
      label: 'statuses.expired',
      color: 'error'
    },
    {
      value: STATUS.REJECT,
      label: 'statuses.reject',
      color: 'error'
    },
    {
      value: STATUS.RECOVERY_INITIATED,
      label: 'statuses.recovery_initiated',
      color: 'default'
    },
    {
      value: STATUS.RECOVERY_APPROVED,
      label: 'statuses.recovery_approved',
      color: 'success'
    },
    {
      value: STATUS.SHARED,
      label: 'statuses.shared',
      color: 'success'
    },
  ],
  SHARE_PERMISSIONS: [
    {
      value: PERMISSION.EDIT,
      role: PERMISSION_ROLE.ADMIN,
      label: 'permissions.editable',
    },
    {
      value: PERMISSION.VIEW,
      role: PERMISSION_ROLE.MEMBER,
      label: 'permissions.viewable',
    },
  ],
  VAULT_TIMEOUTS: [
    {
      value: 1,
      label: 'timeouts.one_minute',
    },
    {
      value: 5,
      label: 'timeouts.five_minutes',
    },
    {
      value: 15,
      label: 'timeouts.fifteen_minutes',
    },
    {
      value: 30,
      label: 'timeouts.thirty_minutes',
    },
    {
      value: 60,
      label: 'timeouts.one_hour',
    },
    {
      value: 60 * 4,
      label: 'timeouts.four_hours',
    },
    {
      value: 60 * 24 * 14,
      label: 'timeouts.two_weeks',
    },
    {
      value: -1,
      label: 'timeouts.on_refresh',
    }
  ],
  VAULT_TIMEOUT_ACTIONS: [
    {
      value: TIMEOUT_ACTION.LOCK,
      label: 'button.lock',
    },
    {
      value: TIMEOUT_ACTION.LOGOUT,
      label: 'button.logout',
    },
  ],
  USER_ACCESSES: [
    {
      value: ACCESS_TYPE.VIEW,
      color: 'success',
      label: 'security.emergency_access.emergency_contact.view',
      description: 'security.emergency_access.emergency_contact.view_description',
    },
    {
      value: ACCESS_TYPE.TAKEOVER,
      color: 'processing',
      label: 'security.emergency_access.emergency_contact.takeover',
      description: 'security.emergency_access.emergency_contact.takeover_description'
    },
  ],
  WAIT_TIMES: [
    {
      value: 1,
      label: 'common.one_day',
    },
    {
      value: 2,
      label: 'common.days_number',
    },
    {
      value: 7,
      label: 'common.days_number',
    },
    {
      value: 14,
      label: 'common.days_number',
    },
    {
      value: 30,
      label: 'common.days_number',
    },
  ],
  CLIENTS: [
    {
      value: 'web',
      name: 'Web Application',
      icon: <GlobalOutlined />
    },
    {
      value: 'browser',
      name: 'Web Extension',
      icon: <ChromeOutlined />
    },
    {
      value: 'mobile',
      name: 'Mobile Application',
      icon: <MobileOutlined />
    },
    {
      value: 'desktop',
      name: 'Desktop Application',
      icon: <DesktopOutlined />
    },
    {
      value: null,
      name: 'Other Application',
      icon: <DesktopOutlined />
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
  ACTIVITY_LOG_ACTIONS: [
    {
      value: ACTIVITY_LOG_ACTION.MEMBER_CHANGES,
      label: 'enterprise_activity_logs.actions.member_status',
    },
    {
      value: ACTIVITY_LOG_ACTION.ROLE_CHANGES,
      label: 'enterprise_activity_logs.actions.role_changes',
    },
    {
      value: ACTIVITY_LOG_ACTION.POLICY_CHANGES,
      label: 'enterprise_activity_logs.actions.policy_violations',
    },
    {
      value: ACTIVITY_LOG_ACTION.USER_LOGIN,
      label: 'enterprise_activity_logs.actions.user_login',
    },
    {
      value: ACTIVITY_LOG_ACTION.SHARE,
      label: 'enterprise_activity_logs.actions.sharing',
    },
  ],
  USER_ROLES: [
    {
      value: USER_ROLE.PRIMARY_ADMIN,
      label: 'roles.primary_admin',
      color: 'success'
    },
    {
      value: USER_ROLE.ADMIN,
      label: 'roles.admin',
      color: 'processing',
      form: true
    },
    {
      value: USER_ROLE.MEMBER,
      label: 'roles.member',
      color: 'default',
      form: true
    }
  ]
}
