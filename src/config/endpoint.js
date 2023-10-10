const API_URL = process.env.REACT_APP_API_URL
const WS_URL = process.env.REACT_APP_WS_URL

const FLAT_FORM = `${API_URL}/v3/cystack_platform/pm`
const WS_FLAT_FORM = `${WS_URL}/cystack_platform/pm`

export default {
  ME: `${API_URL}/v3/sso/me`,

  AUTH: `${API_URL}/v3/sso/auth`,
  AUTH_METHOD: `${API_URL}/v3/sso/auth/method`,
  AUTH_OTP: `${API_URL}/v3/sso/auth/otp`,
  ACCESS_TOKEN: `${API_URL}/v3/sso/access_token`,

  LOGOUT: `${API_URL}/v3/users/logout`,

  USERS_ME: `${FLAT_FORM}/users/me`,
  USERS_SESSION: `${FLAT_FORM}/users/session`,

  WS_SYNC: `${WS_FLAT_FORM}/sync`,

  SYNC: `${FLAT_FORM}/sync`,
  SYNC_COUNT: `${FLAT_FORM}/sync/count`,
  SYNC_CIPHER: `${FLAT_FORM}/sync/ciphers/:id`,
  SYNC_FOLDER: `${FLAT_FORM}/sync/folders/:id`,

  CIPHER: `${FLAT_FORM}/ciphers/:id`,
  CIPHER_USE: `${FLAT_FORM}/ciphers/:id/use`,
  CIPHER_SHARE: `${FLAT_FORM}/ciphers/:id/share`,
  CIPHERS_VAULTS: `${FLAT_FORM}/ciphers/vaults`,
  CIPHERS_DELETE: `${FLAT_FORM}/ciphers/delete`,
  CIPHERS_RESTORE: `${FLAT_FORM}/ciphers/restore`,
  CIPHERS_MOVE: `${FLAT_FORM}/ciphers/move`,
  CIPHERS_PERMANENT_DELETE: `${FLAT_FORM}/ciphers/permanent_delete`,

  FOLDERS:  `${FLAT_FORM}/folders`,
  FOLDER: `${FLAT_FORM}/folders/:id`,
}