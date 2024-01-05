import request from '../utils/request'
import coreServices from './core'
import commonServices from './common'
import global from '../config/global'
import common from '../utils/common'

function device_id() {
  let device_id = localStorage.getItem('device_id')
  if (!device_id) {
    device_id = crypto.randomUUID()
    localStorage.setItem('device_id', device_id)
  }
  return device_id
}

async function get_factor2() {
  return request({
    url: global.endpoint.SSO_ME_FACTOR2,
    method: 'get',
  })
}

async function update_factor2(data) {
  return request({
    url: global.endpoint.SSO_ME_FACTOR2,
    method: 'post',
    data
  })
}

async function factor2_activate(data) {
  return request({
    url: global.endpoint.SSO_ME_FACTOR2_ACTIVATE,
    method: 'post',
    data
  })
}

async function factor2_activate_code(data) {
  return request({
    url: global.endpoint.SSO_ME_FACTOR2_ACTIVATE_CODE,
    method: 'post',
    data
  })
}

function update_access_token(data) {
  localStorage.setItem('access_token', JSON.stringify(data))
}

function access_token() {
  try {
    return JSON.parse(localStorage.getItem('access_token'))
  } catch (_) {
    return ''
  }
}

function update_access_token_type(data) {
  localStorage.setItem('access_token_type', JSON.stringify(data))
}

function access_token_type() {
  try {
    return JSON.parse(localStorage.getItem('access_token_type'))
  } catch (_) {
    return ''
  }
}

function update_sso_account(data) {
  localStorage.setItem('sso_account', JSON.stringify(data))
}

function sso_account() {
  try {
    return JSON.parse(localStorage.getItem('sso_account'))
  } catch (_) {
    return ''
  }
}

function update_redirect_client_id(client_id) {
  sessionStorage.setItem('redirect_client_id', client_id)
}

function redirect_client_id() {
  return sessionStorage.getItem('redirect_client_id')
}

function update_unlock_method(unlock_method) {
  sessionStorage.setItem('unlock_method', unlock_method)
}

function unlock_method() {
  return sessionStorage.getItem('unlock_method')
}

async function redirect_login() {
  update_unlock_method(null)
  await coreServices.lock();
  const currentPage = common.getRouterByLocation(global.location)
  if ([global.keys.AUTHENTICATE, global.keys.SETUP_2FA].includes(currentPage?.name)) {
    return;
  } else if (access_token()) {
    const isError = currentPage?.name === global.keys.ADMIN_ERROR
    const isAdmin = currentPage?.type === 'admin'
    const clientId = currentPage?.query?.client_id || redirect_client_id();
    if (currentPage?.name === global.keys.SIGN_IN && clientId) {
      return;
    }
    global.navigate(global.keys.LOCK, {}, { return_url: encodeURIComponent(!isError && isAdmin ? `${global.location.pathname}${global.location.search}` : '/') })
  } else {
    const serverType = global.store.getState().system.serverType;
    if (currentPage?.name !== global.keys.SIGN_UP || serverType !== global.constants.SERVER_TYPE.PERSONAL) {
      global.navigate(global.keys.SIGN_IN)
    }
  }
}

async function logout(query = {}) {
  if (access_token()) {
    try {
      await request({
        url: global.endpoint.LOGOUT,
        method: 'post',
      })
      await coreServices.logout();
    } catch (error) {
    }
  }
  const userInfo = global.store.getState().auth.userInfo
  if (userInfo?.sync_all_platforms) {
    await commonServices.service_logout();
  }
  update_unlock_method(null);
  update_access_token(null);
  update_sso_account(null)
  global.navigate(global.keys.SIGN_IN, {}, query);
}

export default {
  device_id,
  get_factor2,
  update_factor2,
  factor2_activate,
  factor2_activate_code,
  update_access_token,
  update_access_token_type,
  access_token,
  access_token_type,
  update_sso_account,
  sso_account,
  update_redirect_client_id,
  redirect_client_id,
  redirect_login,
  update_unlock_method,
  unlock_method,
  logout
}
