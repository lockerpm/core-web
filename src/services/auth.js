import request from '../utils/request'
import coreServices from './core'
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

function update_access_token_type(data) {
  localStorage.setItem('access_token_type', JSON.stringify(data))
}

function access_token() {
  try {
    return JSON.parse(localStorage.getItem('access_token'))
  } catch (_) {
    return ''
  }
}

function access_token_type() {
  try {
    return JSON.parse(localStorage.getItem('access_token_type'))
  } catch (_) {
    return ''
  }
}

async function redirect_login() {
  await coreServices.lock();
  const currentPage = common.getRouterByLocation(window.location)
  let isAdmin = !!global.routers.ADMIN_ROUTERS.find((r) => r.name === currentPage?.name);
  if (!currentPage) {
    logout();
    return;
  }
  if (isAdmin) {
    if (access_token()) {
      global.navigate(global.keys.LOCK, {}, { return_url: encodeURIComponent(isAdmin ? `${window.location.pathname}${window.location.search}` : '/') })
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  } else if (currentPage.name === global.keys.OTP_CODE) {
    global.navigate(global.keys.SIGN_IN)
  }
}

async function logout() {
  if (access_token()) {
    try {
      await request({
        url: global.endpoint.LOGOUT,
        method: 'post',
      })
    } catch (error) {
      
    }
  }
  await coreServices.logout()
  localStorage.removeItem('access_token')
  global.navigate(global.keys.SIGN_IN)
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
  redirect_login,
  logout,
}
