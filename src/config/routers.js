import keys from './keys'

export default {
  AUTH_ROUTERS: [
    {
      name: keys.AUTHENTICATE,
      path: '/authentication',
      element: 'Authenticate'
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
      name: keys.SETUP_2FA,
      path: '/setup-2fa',
      element: 'Setup2FA',
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

  PUBLIC_ROUTERS: [
    {
      name: keys.QUICK_SHARE_DETAIL,
      path: '/quick-shares/:id',
      element: 'QuickShareDetail',
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
      path: '/vault/:cipher_id',
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
      path: '/passwords/:cipher_id',
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
      path: '/notes/:cipher_id',
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
      path: '/cards/:cipher_id',
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
      path: '/crypto-backups/:cipher_id',
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
      path: '/identities/:cipher_id',
      element: 'VaultDetail',
    },
    {
      name: keys.FOLDERS,
      path: '/folders',
      element: 'Folders',
    },
    {
      name: keys.FOLDER_DETAIL,
      path: '/folders/:folder_id',
      element: 'Vault',
      parent: keys.FOLDERS,
    },
    {
      name: keys.AUTHENTICATOR,
      path: '/authenticator',
      element: 'Authenticator',
    },
    {
      name: keys.SHARED_WITH_ME,
      path: '/shares/shared-with-me',
      element: 'SharedWithMe',
    },
    {
      name: keys.MY_SHARED_ITEMS,
      path: '/shares/my-shared-items',
      element: 'MySharedItems',
    },
    {
      name: keys.TRASH,
      path: '/trash',
      element: 'Vault',
    },
    {
      name: keys.TRASH_DETAIL,
      parent: keys.TRASH,
      path: '/trash/:cipher_id',
      element: 'VaultDetail',
    },
    {
      name: keys.SECURITY_TOOLS,
      path: '/security-tools',
      element: 'SecurityTools',
    },
    {
      name: keys.PASSWORD_HEALTH,
      parent: keys.SECURITY_TOOLS,
      path: '/security-tools/password-health',
      element: 'PasswordHealth',
      label: 'security_tools.password_health.title',
    },
    {
      name: keys.BREACH_SCANNER,
      parent: keys.SECURITY_TOOLS,
      path: '/security-tools/breach-scanner',
      element: 'BreachScanner',
      label: 'security_tools.data_breach_scanner.title',
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
      name: keys.EMERGENCY_ACCESS_VIEW,
      path: '/settings/emergency-access/:contact_id',
      element: 'EmergencyAccessView',
      label: 'emergency_access_view.title',
      parent: keys.SETTINGS_SECURITY,
    },
    {
      name: keys.SETTINGS_NOTIFICATIONS,
      path: '/settings/notifications',
      element: 'SettingsNotifications',
    },

    // Enterprises
    {
      name: keys.ENTERPRISES,
      path: '/enterprises',
      element: 'Enterprises',
    },
    {
      name: keys.EMAIL_SETTINGS,
      path: '/enterprises/email-settings',
      element: 'EmailSettings',
    },
    {
      name: keys.SSO_CONFIGURATION,
      path: '/enterprises/sso-configuration',
      element: 'SSOConfiguration',
    },

    // Enterprise detail
    {
      name: keys.ENTERPRISE_DASHBOARD,
      path: '/enterprises/:enterprise_id/dashboard',
      element: 'EnterpriseDashboard',
    },
    {
      name: keys.ENTERPRISE_MEMBERS,
      path: '/enterprises/:enterprise_id/users',
      element: 'EnterpriseMembers',
    },
    {
      name: keys.ENTERPRISE_MEMBER,
      path: '/enterprises/:enterprise_id/users/:member_id',
      parent: keys.ENTERPRISE_MEMBERS,
      element: 'EnterpriseMember',
    },
    {
      name: keys.ENTERPRISE_GROUPS,
      path: '/enterprises/:enterprise_id/groups',
      element: 'EnterpriseGroups',
    },
    {
      name: keys.ENTERPRISE_POLICIES,
      path: '/enterprises/:enterprise_id/policy',
      element: 'EnterprisePolicies',
    },
    {
      name: keys.ENTERPRISE_ACTIVITY_LOGS,
      path: '/enterprises/:enterprise_id/activity-logs',
      element: 'EnterpriseActivityLogs',
    },
  ],
}
