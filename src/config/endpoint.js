const BACKEND_URL = process.env.REACT_APP_API_URL
const FLAT_FORM = `${BACKEND_URL}/v3/cystack_platform/pm`
export default {
  ME: `${BACKEND_URL}/v3/sso/me`,

  AUTH: `${BACKEND_URL}/v3/sso/auth`,
  AUTH_METHOD: `${BACKEND_URL}/v3/sso/auth/method`,
  AUTH_OTP: `${BACKEND_URL}/v3/sso/auth/otp`,
  ACCESS_TOKEN: `${BACKEND_URL}/v3/sso/access_token`,

  LOGOUT: `${BACKEND_URL}/v3/users/logout`,

  USERS_ME: `${FLAT_FORM}/users/me`,
  USERS_SESSION: `${FLAT_FORM}/users/session`,

  SYNC: `${FLAT_FORM}/sync`,
  SYNC_COUNT: `${FLAT_FORM}/sync/count`,
}