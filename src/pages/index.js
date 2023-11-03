// Auth pages
import Authenticate from './auth/authenticate'
import SignIn from './auth/sign-in'
import SignUp from './auth/sign-up'
import OtpCode from './auth/otp-code'
import Lock from './auth/lock'

// Errors pages
import Error403 from './errors/403'
import Error404 from './errors/404'

// Admin Pages
import Vault from './admin/vault'
import VaultDetail from './admin/vault/detail'
import Folders from './admin/folders'
import Authenticator from './admin/otps'
import SharedWithMe from './admin/shares/shared-with-me'
import MySharedItems from './admin/shares/my-shared-items'

// Setting pages
import SettingsAccount from './admin/settings/settings-account'
import SettingsImportExport from './admin/settings/settings-import-export'
import SettingsSecurity from './admin/settings/settings-security'
import SettingsNotifications from './admin/settings/settings-notifications'
import EmergencyAccessView from './admin/settings/emergency-access-view'

// Admin Error page
import AdminErrorPage from './admin/errors'

export default {
  // Auth pages
  Authenticate,
  SignIn,
  SignUp,
  OtpCode,
  Lock,

  Error403,
  Error404,

  Vault,
  VaultDetail,
  Folders,
  Authenticator,
  SharedWithMe,
  MySharedItems,

  SettingsAccount,
  SettingsImportExport,
  SettingsSecurity,
  SettingsNotifications,
  EmergencyAccessView,

  AdminErrorPage
}