// Admin Pages
import Vault from './vault'
import VaultDetail from './vault/detail'
import VaultHistory from './vault/history'
import Folders from './folders'
import Authenticator from './otps'
import SharedWithMe from './shares/shared-with-me'
import MySharedItems from './shares/my-shared-items'
import QuickShareDetail from './shares/quick-share-detail'
import SecurityTools from './security-tools'
import PasswordHealth from './security-tools/password-health'
import BreachScanner from './security-tools/breach-scanner'
import SettingsAccount from './settings/settings-account'
import SettingsImportExport from './settings/settings-import-export'
import SettingsSecurity from './settings/settings-security'
import SettingsNotifications from './settings/settings-notifications'
import EmergencyAccessView from './settings/emergency-access-view'

import AdminErrorPage from './errors'

export default {
  Vault,
  VaultDetail,
  VaultHistory,
  Folders,
  Authenticator,
  SharedWithMe,
  MySharedItems,
  QuickShareDetail,
  SecurityTools,
  PasswordHealth,
  BreachScanner,

  SettingsAccount,
  SettingsImportExport,
  SettingsSecurity,
  SettingsNotifications,
  EmergencyAccessView,

  AdminErrorPage
}