import keys from './keys'

export default {
  AUTH_ROUTERS: [
    {
      name: keys.AUTHENTICATE,
      path: '/authenticate',
      element: 'Authenticate',
    },
    {
      name: keys.SIGN_IN,
      path: '/sign-in',
      element: 'SignIn',
      not_auth: true
    },
    {
      name: keys.SIGN_UP,
      path: '/sign-up',
      element: 'SignUp',
      not_auth: true
    },
    {
      name: keys.LOCK,
      path: '/lock',
      element: 'Lock',
      not_auth: true
    },
    {
      name: keys.OTP_CODE,
      path: '/otp-code',
      element: 'OtpCode',
    },
    {
      name: keys.CREATE_MASTER_PASSWORD,
      path: '/create-master-password',
      element: 'CreateMasterPassword',
    },
  ],

  ERROR_ROUTERS: [
    {
      name: keys.ERROR_404,
      path: '/errors/404',
      element: 'Error404',
      not_auth: true
    },
    {
      name: keys.ERROR_403,
      path: '/errors/403',
      element: 'Error403',
      not_auth: true
    }
  ],

  ADMIN_ROUTERS: [
    {
      name: keys.ADMIN_ERROR,
      path: '/admin-error',
      element: 'AdminErrorPage',
    },
    {
      name: keys.VAULT,
      path: '/',
      element: 'Vault',
    },
    {
      name: keys.VAULT_DETAIL,
      parent: keys.VAULT,
      path: '/vault/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.PASSWORDS,
      path: '/passwords',
      element: 'Vault',
    },
    {
      name: keys.PASSWORD_DETAIL,
      parent: keys.PASSWORDS,
      path: '/passwords/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.NOTES,
      path: '/notes',
      element: 'Vault',
    },
    {
      name: keys.NOTE_DETAIL,
      parent: keys.NOTES,
      path: '/notes/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.CARDS,
      path: '/cards',
      element: 'Vault',
    },
    {
      name: keys.CARD_DETAIL,
      parent: keys.CARDS,
      path: '/cards/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.CRYPTO_BACKUPS,
      path: '/crypto-backups',
      element: 'Vault',
    },
    {
      name: keys.CRYPTO_BACKUP_DETAIL,
      parent: keys.CRYPTO_BACKUPS,
      path: '/crypto-backups/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.IDENTITIES,
      path: '/identities',
      element: 'Vault',
    },
    {
      name: keys.IDENTITY_DETAIL,
      parent: keys.IDENTITIES,
      path: '/identities/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.FOLDERS,
      path: '/folders',
      element: 'Folders',
    },
    {
      name: keys.AUTHENTICATOR,
      path: '/authenticator',
      element: 'Authenticator',
    },
    {
      name: keys.SECURITY_TOOLS,
      path: '/tools',
      element: 'Tools',
    },
    {
      name: keys.SHARES,
      path: '/shares',
      element: 'shares',
    },
    {
      name: keys.TRASH,
      path: '/trash',
      element: 'Trash',
    },
    {
      name: keys.TRASH_DETAIL,
      path: '/trash/:id',
      element: 'VaultDetail',
    },
    {
      name: keys.SETTINGS_ACCOUNT,
      path: '/settings/account',
      element: 'SettingsAccount',
    },
    {
      name: keys.SETTINGS_IMPORT_EXPORT,
      path: '/settings/import-export',
      element: 'SettingsImportExport',
    },
    {
      name: keys.SETTINGS_SECURITY,
      path: '/settings/security',
      element: 'SettingsSecurity',
    },
    {
      name: keys.SETTINGS_NOTIFICATIONS,
      path: '/settings/notifications',
      element: 'SettingsNotifications',
    }
  ],
}
