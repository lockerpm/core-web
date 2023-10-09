import constants from './constants'
import { Trans } from 'react-i18next'

export default {
  AUTH_ROUTERS: [
    {
      name: 'AUTHENTICATE',
      path: '/authenticate',
      element: 'Authenticate',
    },
    {
      name: 'SIGN_IN',
      path: '/sign-in',
      element: 'SignIn',
      not_auth: true
    },
    {
      name: 'SIGN_UP',
      path: '/sign-up',
      element: 'SignUp',
      not_auth: true
    },
    {
      name: 'LOCK',
      path: '/lock',
      element: 'Lock',
      not_auth: true
    },
    {
      name: 'OTP_CODE',
      path: '/otp-code',
      element: 'OtpCode',
    },
    {
      name: 'CREATE_MASTER_PASSWORD',
      path: '/create-master-password',
      element: 'CreateMasterPassword',
    },
  ],

  ERROR_ROUTERS: [
    {
      name: '404',
      path: '/errors/404',
      element: 'Error404',
      not_auth: true
    },
    {
      name: '403',
      path: '/errors/403',
      element: 'Error403',
      not_auth: true
    }
  ],

  ADMIN_ROUTERS: [
    {
      name: 'ADMIN_ERROR',
      path: '/admin-error',
      element: 'AdminErrorPage',
    },
    {
      name: 'VAULT',
      path: '/',
      element: 'Vault',
    },
    {
      name: 'PASSWORDS',
      path: '/passwords',
      element: 'Passwords',
    },
    {
      name: 'NOTES',
      path: '/notes',
      element: 'Notes',
    },
    {
      name: 'CARDS',
      path: '/cards',
      element: 'Cards',
    },
    {
      name: 'CRYPTO_BACKUPS',
      path: '/crypto-backups',
      element: 'CryptoBackups',
    },
    {
      name: 'IDENTITIES',
      path: '/identities',
      element: 'Identities',
    },
    {
      name: 'FOLDERS',
      path: '/folders',
      element: 'Folders',
    },
    {
      name: 'AUTHENTICATOR',
      path: '/authenticator',
      element: 'Authenticator',
    },
    {
      name: 'SECURITY_TOOLS',
      path: '/tools',
      element: 'Tools',
    },
    {
      name: 'SHARES',
      path: '/shares',
      element: 'shares',
    },
    {
      name: 'PRIVATE_EMAIL',
      path: '/relay',
      element: 'PrivateEmail',
    },
    {
      name: 'TRASH',
      path: '/trash',
      element: 'Trash',
    },
    {
      name: 'SETTINGS_ACCOUNT',
      path: '/settings/account',
      element: 'SettingsAccount',
    },
    {
      name: 'SETTINGS_IMPORT_EXPORT',
      path: '/settings/import-export',
      element: 'SettingsImportExport',
    },
    {
      name: 'SETTINGS_SECURITY',
      path: '/settings/security',
      element: 'SettingsSecurity',
    },
    {
      name: 'SETTINGS_NOTIFICATION',
      path: '/settings/notifications',
      element: 'SettingsNotifications',
    }
  ],
}
