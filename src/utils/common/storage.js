import global from "../../config/global"

// Start Sync Function
const getDeviceId = async () => {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}

const updateAccessToken = async (data) => {
  localStorage.setItem('access_token', JSON.stringify(data))
}

const getAccessToken = async () => {
  try {
    return JSON.parse(localStorage.getItem('access_token'))
  } catch (_) {
    return ''
  }
}

const updateAccessTokenType = async (data) => {
  localStorage.setItem('access_token_type', JSON.stringify(data))
}

const getAccessTokenType = async () => {
  try {
    return JSON.parse(localStorage.getItem('access_token_type'))
  } catch (_) {
    return ''
  }
}

const updateUnlockMethod = async (data) => {
  sessionStorage.setItem('unlock_method', data)
}

const getUnlockMethod = async () => {
  return sessionStorage.getItem('unlock_method')
}
// End Sync Function

const updateLanguage = (data) => {
  localStorage.setItem('passwords-language', JSON.stringify(data))
}

const getLanguage = () => {
  const langDefault = global.constants.LANGUAGE.EN;
  try {
    const lang = JSON.parse(localStorage.getItem('passwords-language'))
    return Object.values(global.constants.LANGUAGE).includes(lang) ? lang : langDefault
  } catch (_) {
    return langDefault
  }
}

const updateSsoAccount = (data) => {
  localStorage.setItem('sso_account', JSON.stringify(data))
}

const getSsoAccount = () => {
  try {
    return JSON.parse(localStorage.getItem('sso_account'))
  } catch (_) {
    return ''
  }
}

const updateRedirectClientId = (data) => {
  sessionStorage.setItem('redirect_client_id', data)
}

const getRedirectClientId = () => {
  return sessionStorage.getItem('redirect_client_id')
}

export default {
  getDeviceId,
  updateAccessToken,
  getAccessToken,
  updateAccessTokenType,
  getAccessTokenType,
  updateSsoAccount,
  getSsoAccount,
  updateRedirectClientId,
  getRedirectClientId,
  updateUnlockMethod,
  getUnlockMethod,
  updateLanguage,
  getLanguage
}