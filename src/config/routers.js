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
      name: keys.SHARE_DETAIL,
      path: '/quick-shares/:id',
      element: 'ShareDetail',
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
      name: keys.VAULT_HISTORY,
      parent: keys.VAULT_DETAIL,
      path: '/vault/:cipher_id/history',
      element: 'VaultHistory',
      label: 'password_history.title'
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
      name: keys.PASSWORD_HISTORY,
      parent: keys.PASSWORD_DETAIL,
      path: '/passwords/:cipher_id/history',
      element: 'VaultHistory',
      label: 'password_history.title'
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
      name: keys.FOLDER_DETAIL_ITEM,
      path: '/folders/:folder_id/:cipher_id',
      element: 'VaultDetail',
      parent: keys.FOLDER_DETAIL,
    },
    {
      name: keys.FOLDER_DETAIL_ITEM_HISTORY,
      parent: keys.FOLDER_DETAIL_ITEM,
      path: '/folders/:folder_id/:cipher_id/history',
      element: 'VaultHistory',
      label: 'password_history.title'
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
      name: keys.SHARED_WITH_ME_ITEM,
      path: '/shares/shared-with-me/items/:cipher_id',
      element: 'VaultDetail',
      parent: keys.SHARED_WITH_ME,
    },
    {
      name: keys.SHARED_WITH_ME_ITEM_HISTORY,
      path: '/shares/shared-with-me/items/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.SHARED_WITH_ME_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.SHARED_WITH_ME_FOLDER,
      path: '/shares/shared-with-me/folders/:folder_id',
      element: 'Vault',
      parent: keys.SHARED_WITH_ME,
    },
    {
      name: keys.SHARED_WITH_ME_FOLDER_ITEM,
      path: '/shares/shared-with-me/folders/:folder_id/:cipher_id',
      element: 'VaultDetail',
      parent: keys.SHARED_WITH_ME_FOLDER,
    },
    {
      name: keys.SHARED_WITH_ME_FOLDER_ITEM_HISTORY,
      path: '/shares/shared-with-me/folders/:folder_id/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.SHARED_WITH_ME_FOLDER_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.MY_SHARED_ITEMS,
      path: '/shares/my-shared-items',
      element: 'MySharedItems',
    },
    {
      name: keys.MY_SHARED_ITEMS_ITEM,
      path: '/shares/my-shared-items/items/:cipher_id',
      element: 'VaultDetail',
      parent: keys.MY_SHARED_ITEMS,
    },
    {
      name: keys.MY_SHARED_ITEMS_ITEM_HISTORY,
      path: '/shares/my-shared-items/items/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.MY_SHARED_ITEMS_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.MY_SHARED_ITEMS_FOLDER,
      path: '/shares/my-shared-items/folders/:folder_id',
      element: 'Vault',
      parent: keys.MY_SHARED_ITEMS,
    },
    {
      name: keys.MY_SHARED_ITEMS_FOLDER_ITEM,
      path: '/shares/my-shared-items/folders/:folder_id/:cipher_id',
      element: 'VaultDetail',
      parent: keys.MY_SHARED_ITEMS_FOLDER,
    },
    {
      name: keys.MY_SHARED_ITEMS_FOLDER_ITEM_HISTORY,
      path: '/shares/my-shared-items/:folder_id/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.MY_SHARED_ITEMS_FOLDER_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.QUICK_SHARE_DETAIL,
      path: '/shares/quick-shares/:send_id',
      element: 'QuickShareDetail',
      parent: keys.MY_SHARED_ITEMS,
    },
    {
      name: keys.TRASH,
      path: '/trash',
      element: 'Vault',
    },
    {
      name: keys.TRASH_DETAIL,
      path: '/trash/:cipher_id',
      element: 'VaultDetail',
      parent: keys.TRASH,
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
      name: keys.PASSWORD_HEALTH_WEAK_ITEM,
      path: '/security-tools/password-health/weak/:cipher_id',
      element: 'VaultDetail',
      parent: keys.PASSWORD_HEALTH,
    },
    {
      name: keys.PASSWORD_HEALTH_WEAK_ITEM_HISTORY,
      path: '/security-tools/password-health/weak/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.PASSWORD_HEALTH_WEAK_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.PASSWORD_HEALTH_REUSED_ITEM,
      path: '/security-tools/password-health/reused/:cipher_id',
      element: 'VaultDetail',
      parent: keys.PASSWORD_HEALTH,
    },
    {
      name: keys.PASSWORD_HEALTH_REUSED_ITEM_HISTORY,
      path: '/security-tools/password-health/reused/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.PASSWORD_HEALTH_REUSED_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.PASSWORD_HEALTH_EXPOSED_ITEM,
      path: '/security-tools/password-health/exposed/:cipher_id',
      element: 'VaultDetail',
      parent: keys.PASSWORD_HEALTH,
    },
    {
      name: keys.PASSWORD_HEALTH_EXPOSED_ITEM_HISTORY,
      path: '/security-tools/password-health/exposed/:cipher_id/history',
      element: 'VaultHistory',
      parent: keys.PASSWORD_HEALTH_EXPOSED_ITEM,
      label: 'password_history.title'
    },
    {
      name: keys.BREACH_SCANNER,
      path: '/security-tools/breach-scanner',
      element: 'BreachScanner',
      label: 'security_tools.data_breach_scanner.title',
      parent: keys.SECURITY_TOOLS,
    },
    {
      name: keys.POLICIES,
      path: '/policies',
      element: 'Policies',
      label: 'policies.title',
    },
    {
      name: keys.POLICIES_VIOLATED,
      path: '/policies/violated',
      element: 'PoliciesViolated',
      label: 'policies_violated.title',
      parent: keys.POLICIES,
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
      path: '/settings/security/emergency-access/:contact_id',
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
