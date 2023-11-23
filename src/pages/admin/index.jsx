// Admin Pages
import Vault from './vault'
import VaultDetail from './vault/detail'
import Folders from './folders'
import Authenticator from './otps'
import SharedWithMe from './shares/shared-with-me'
import MySharedItems from './shares/my-shared-items'
import SecurityTools from './security-tools'
import PasswordHealth from './security-tools/password-health'
import BreachScanner from './security-tools/breach-scanner'
import SettingsAccount from './settings/settings-account'
import SettingsImportExport from './settings/settings-import-export'
import SettingsSecurity from './settings/settings-security'
import SettingsNotifications from './settings/settings-notifications'
import EmergencyAccessView from './settings/emergency-access-view'

import Enterprise from './enterprise'
import Companies from './enterprise/companies'
import EmailSettings from './enterprise/email-settings'
import SSOConfiguration from './enterprise/sso-configuration'

import AdminErrorPage from './errors'

export default {
  Vault,
  VaultDetail,
  Folders,
  Authenticator,
  SharedWithMe,
  MySharedItems,
  SecurityTools,
  PasswordHealth,
  BreachScanner,

  SettingsAccount,
  SettingsImportExport,
  SettingsSecurity,
  SettingsNotifications,
  EmergencyAccessView,

  Enterprise,
  Companies,
  EmailSettings,
  SSOConfiguration,

  AdminErrorPage
}