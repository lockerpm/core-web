import request from '../utils/request'
import coreServices from './core'
import global from '../config/global'
import common from '../utils/common'

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

async function redirect_login() {
  await common.updateUnlockMethod(null)
  await coreServices.lock();
  const currentPage = common.getRouterByLocation(global.location);
  const accessToken = await common.getAccessToken();
  if ([global.keys.AUTHENTICATE, global.keys.SETUP_2FA].includes(currentPage?.name)) {
    return;
  } else if (accessToken) {
    const isError = currentPage?.name === global.keys.ADMIN_ERROR
    const isAdmin = currentPage?.type === 'admin'
    const clientId = currentPage?.query?.client_id || common.getRedirectClientId();
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

async function logout(isLogoutId = false) {
  const accessToken = await common.getAccessToken();
  if (accessToken && isLogoutId) {
    try {
      await request({
        url: global.endpoint.LOGOUT,
        method: 'post',
      })
      await coreServices.logout();
    } catch (error) {
    }
  }
  await common.updateUnlockMethod(null);
  await common.updateAccessToken(null);
  common.updateSsoAccount(null)
  global.navigate(global.keys.SIGN_IN, {}, {});
}

export default {
  get_factor2,
  update_factor2,
  factor2_activate,
  factor2_activate_code,
  redirect_login,
  logout
}
