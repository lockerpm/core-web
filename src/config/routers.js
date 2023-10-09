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
      name: 'CHANGE_INFORMATION',
      path: '/change-information',
      element: 'ChangeInformation'
    },
    {
      name: 'OTP_CODE',
      path: '/otp-code',
      element: 'OtpCode',
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
      name: 'ACCOUNT_DETAILS',
      path: '/account-details',
      element: 'AccountDetails',
      label: <Trans i18nKey='account_details.title' />,
    },
    {
      name: 'ACCOUNT_NOTIFICATIONS',
      path: '/account-notifications',
      element: 'AccountNotifications',
      label: <Trans i18nKey='notifications.title' />,
    },
    {
      name: 'ACCOUNT_MANAGE_SESSIONS',
      path: '/account-manage-sessions',
      element: 'AccountManageSessions',
      label: <Trans i18nKey='manage_sessions.title' />,
    },
    {
      name: 'ACCOUNT_CHANGE_PASSWORD',
      path: '/account-details/change-password',
      element: 'AccountChangePassword',
      parent: 'ACCOUNT_DETAILS',
      label: <Trans i18nKey='change_password.title' />,
    },
    {
      name: 'ACCOUNT_2FA',
      path: '/account-details/two-factor-authentication',
      element: 'Account2FA',
      parent: 'ACCOUNT_DETAILS',
      label: <Trans i18nKey='2fa.title' />,
    },
  ],
}
