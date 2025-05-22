import global from '../../config/global';
import { Trans } from 'react-i18next';
import creditCardType from 'credit-card-type';
import common from '.';

const has = Object.prototype.hasOwnProperty

const isDiff = (A, B) => JSON.stringify(A) !== JSON.stringify(B)

const isEmpty = prop => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  )
}

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const scrollToTop = () => {
  const layoutContent = document.querySelector('.layout-content')
  if (layoutContent) {
    layoutContent.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}

const getColorByIndex = index => {
  const colors = require('@ant-design/colors')
  const newColors = []
  Object.keys(colors).forEach(k => {
    if (Array.isArray(colors[k])) {
      newColors.push(colors[k])
    }
  })
  const colorTotal = newColors.length * newColors[0].length
  let i = index
  if (index >= colorTotal) {
    i = index - colorTotal
  }
  const key1 = i % newColors.length
  const key2 = Math.floor((i + 1) / newColors.length)
  return newColors[key1][key2]
}

const openNewTab = (link) => {
  window.open(link, '_blank')
}

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  global.pushSuccess(<Trans i18nKey='notification.success.copied' />)
};

const detectCardBrand = (cardNumber) => {
  if (!cardNumber) {
    return null
  }
  const card = creditCardType(cardNumber)
  return card[0]?.niceType || null
}

const cardBrandByNumber = (number) => {
  const cardLabel = detectCardBrand(number)
  const brandOption = global.constants.CARD_BRAND_OPTIONS.find(o => o.label === cardLabel)
  if (brandOption) {
    return brandOption.value
  }
  if (cardLabel) {
    return 'Other'
  }
  return null
}

const selectedWalletApp = (alias) => {
  return global.constants.WALLET_APPS.find((a) => a.alias === alias) || { name: '', alias: '' }
}

const selectedNetworks = (aliases = []) => {
  return global.constants.CHAINS.filter((a) => aliases.includes(a.alias)) || []
}

const getOrganization = (id) => {
  return global.store.getState().organization.allOrganizations.find((o) => o.id === id)
}

const getStatus = (status) => {
  return global.constants.STATUSES.find((s) => !s.value || s.value === status)
}

const getAccess = (access) => {
  return global.constants.USER_ACCESSES.find((s) => s.value === access)
}

const getSharePermission = (permission) => {
  return global.constants.SHARE_PERMISSIONS.find((s) => !s.value || s.value === permission)
}

const getEmergencyAccessDays = (contact) => {
  return (
    ((contact.recovery_initiated_date +
      contact.wait_time_days * 24 * 60 * 60) *
      1000 -
      new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed(1)
}

const getClientInfo = (clientId) => {
  return global.constants.CLIENTS.find((s) => !s.value || s.value === clientId)
}

const getToken = (email, id) => {
  try {
    const token = JSON.parse(localStorage.getItem(`token_${email}`))
    if (token.expiredTime * 1000 < Date.now()) {
      localStorage.removeItem(`token_${email}`)
      return null
    }
    if (!token.id || id === token.id) {
      return token.value
    }
    return null
  } catch (error) {
    localStorage.removeItem(`token_${email}`)
    return null
  }
}

const getMessage = (error) => {
  if (Array.isArray(error)) {
    return getMessage(error[0])
  }
  if (typeof error === "object") {
    const keys = Object.keys(error)
    return getMessage(error[keys[0]])
  }
  return error
}

const getErrorMessage = (error) => {
  const errorData = error?.response?.data || error?.response || error;
  let message = errorData?.message || error?.message || error.toString();
  if (errorData?.details && !common.isEmpty(errorData?.details)) {
    const errorKeys = Object.keys(errorData.details)
    message = getMessage(errorData.details[errorKeys[0]]) || message;
  }
  return {
    code: errorData?.code || null,
    message: message,
  }
}

const getUserRole = (role) => {
  return global.constants.USER_ROLES.find((s) => !s.value || s.value === role)
}

const ssoRedirectUri = () => {
  return `${window.location.origin}/sign-in`;
}

const redirectToAuthSSO = (ssoConfig) => {
  const redirectUri = ssoRedirectUri();
  const authorize = ssoConfig.authorization_endpoint;
  const clientId = ssoConfig.client_id;
  window.location.replace(`${authorize}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`)
}

const openDesktopApp = () => {
  window.location.replace(`locker-app://`)
}

const allRouters = () => {
  return [
    ...global.routers.AUTH_ROUTERS.map(r => ({ ...r, type: 'auth' })),
    ...global.routers.ERROR_ROUTERS.map(r => ({ ...r, type: 'error' })),
    ...global.routers.PUBLIC_ROUTERS.map(r => ({ ...r, type: 'public' })),
    ...global.routers.ADMIN_ROUTERS.map(r => ({ ...r, type: 'admin' })),
  ].map(r => ({
    ...r,
    keys: r.path.split('/'),
  }))
}

const allMenus = () => {
  return global.menus.ADMIN_MENUS;
}

export default {
  isDiff,
  isEmpty,
  uuidv4,
  randomColor,
  scrollToTop,
  getColorByIndex,
  openNewTab,
  copyToClipboard,
  detectCardBrand,
  cardBrandByNumber,
  selectedWalletApp,
  selectedNetworks,
  getOrganization,
  getStatus,
  getAccess,
  getSharePermission,
  getEmergencyAccessDays,
  getClientInfo,
  getToken,
  getErrorMessage,
  getUserRole,
  ssoRedirectUri,
  redirectToAuthSSO,
  openDesktopApp,
  allRouters,
  allMenus
}