import global from "../../config/global"

const deviceId = () => {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}

const updateAccessToken = (data) => {
  localStorage.setItem('access_token', JSON.stringify(data))
}

const getAccessToken = () => {
  try {
    return JSON.parse(localStorage.getItem('access_token'))
  } catch (_) {
    return ''
  }
}

const updateAccessTokenType = (data) => {
  localStorage.setItem('access_token_type', JSON.stringify(data))
}

const getAccessTokenType = () => {
  try {
    return JSON.parse(localStorage.getItem('access_token_type'))
  } catch (_) {
    return ''
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

const updateUnlockMethod = (data) => {
  sessionStorage.setItem('unlock_method', data)
}

const getUnlockMethod = () => {
  return sessionStorage.getItem('unlock_method')
}

const updateLanguage = (data) => {
  localStorage.setItem('passwords-language', JSON.stringify(data))
}

const getLanguage = () => {
  try {
    const lang = JSON.parse(localStorage.getItem('passwords-language'))
    return [
      global.constants.LANGUAGE.EN,
      global.constants.LANGUAGE.VI,
      global.constants.LANGUAGE.ZH
    ].includes(lang) ? lang : global.constants.LANGUAGE.EN
  } catch (_) {
    return global.constants.LANGUAGE.EN
  }
}

export default {
  deviceId,
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