// Auth pages
import Authenticate from './auth/authenticate'
import SignIn from './auth/sign-in'
import SignUp from './auth/sign-up'
import Splash from './auth/splash'
import OtpCode from './auth/otp-code'

// Errors pages
import Error403 from './errors/403'
import Error404 from './errors/404'

// Account pages
import AccountDetails from './admin/account/details'
import AccountNotifications from './admin/account/notifications'
import AccountManageSessions from './admin/account/sessions'
import AccountChangePassword from './admin/account/change-password'
import Account2FA from './admin/account/2fa'

// API Error page
import AdminErrorPage from './admin/errors'

export default {
  // Auth pages
  Authenticate,
  SignIn,
  SignUp,
  Splash,
  OtpCode,

  Error403,
  Error404,

  AccountDetails,
  AccountNotifications,
  AccountManageSessions,
  AccountChangePassword,
  Account2FA,

  AdminErrorPage
}