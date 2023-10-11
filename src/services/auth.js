import request from '../utils/request'
import Cookies from 'js-cookie'
import coreServices from './core'
import global from '../config/global'
import common from '../utils/common'

function device_id() {
  let device_id = Cookies.get('device_id')
  if (!device_id) {
    device_id = crypto.randomUUID()
    Cookies.set('device_id', device_id)
  }
  return device_id
}

function auth_method(data) {
  return request({
    url: global.endpoint.AUTH_METHOD,
    method: 'post',
    data: data
  })
}

async function login(data = {}) {
  return request({
    url: global.endpoint.AUTH,
    method: 'post',
    data: data
  })
}

async function login_by_otp(data = {}) {
  const payload = await coreServices.login_payload(data)
  return request({
    url: global.endpoint.AUTH_OTP,
    method: 'post',
    data: {
      ...data,
      ...payload,
      client_id: 'web',
      device_id: device_id(),
      device_name: global.jsCore.platformUtilsService.getDeviceString()
    }
  })
}

function update_access_token(data) {
  Cookies.set('access_token', JSON.stringify(data))
}

function update_access_token_type(data) {
  Cookies.set('access_token_type', JSON.stringify(data))
}

function access_token() {
  try {
    return JSON.parse(Cookies.get('access_token'))
  } catch (_) {
    return ''
  }
}

function access_token_type() {
  try {
    return JSON.parse(Cookies.get('access_token_type'))
  } catch (_) {
    return ''
  }
}

async function redirect_login() {
  await coreServices.lock();
  const currentPage = common.getRouterByLocation(window.location)
  let isAdmin = !!global.routers.ADMIN_ROUTERS.find((r) => r.name === currentPage?.name)
  if (access_token()) {
    global.navigate(global.keys.LOCK, {}, { return_url: encodeURIComponent(isAdmin ? `${window.location.pathname}${window.location.search}` : '/') })
  } else {
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
  Cookies.remove('access_token')
  global.navigate(global.keys.SIGN_IN)
}

export default {
  device_id,
  auth_method,
  login,
  login_by_otp,
  update_access_token,
  update_access_token_type,
  access_token,
  access_token_type,
  redirect_login,
  logout,
}
