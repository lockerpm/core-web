import request from '../utils/request'
import otherRequest from '../utils/other-request'

import authServices from './auth'
import coreServices from './core'
import Cookies from 'js-cookie'
import global from '../config/global'

import {
  getRouterByLocation
} from '../utils/common'

function update_account_info(data) {
  Cookies.set('account_info', JSON.stringify(data))
}

function account_info() {
  try {
    return JSON.parse(Cookies.get('account_info'))
  } catch (_) {
    return null
  }
}

async function sign_up(data = {}) {
  const payload = await coreServices.auth_payload(data)
  return request({
    url: global.endpoint.USERS_REGISTER,
    method: 'post',
    data: {
      ...payload,
      client_id: 'web',
      device_id: authServices.device_id(),
      device_name: global.jsCore.platformUtilsService.getDeviceString()
    }
  })
}

async function update(data = {}) {
  return request({
    url: global.endpoint.USERS_ME,
    method: 'put',
    data: data
  })
}

async function change_password(data = {}) {
  const username = account_info().username

  const storedKeyHash = await global.jsCore.cryptoService.getKeyHash() || null

  const oldMakeKey = data.password ? await coreServices.make_key(username, data.password) : null
  const password = data.password ? await global.jsCore.cryptoService.hashPassword(data.password, oldMakeKey) : storedKeyHash

  const makeKey = await coreServices.make_key(username, data.new_password)
  const new_password = await global.jsCore.cryptoService.hashPassword(data.new_password, makeKey)
  const confirm_new_password = await global.jsCore.cryptoService.hashPassword(data.confirm_new_password, makeKey)

  let payload = {
    password: password || '',
    new_password,
    confirm_new_password,
  }
  if (password) {
    const encKey = await global.jsCore.cryptoService.remakeEncKey(makeKey)
    payload = {
      ...payload,
      new_key: encKey[1].encryptedString,
    }
  } else {
    const encKey = await global.jsCore.cryptoService.makeEncKey(makeKey)
    const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])
    payload = {
      ...payload,
      is_check_password: data.is_check_password,
      new_key: encKey[1].encryptedString,
      new_public_key: keys[0],
      new_private_key: keys[1].encryptedString,
    }
  }

  return request({
    url: global.endpoint.USERS_CHANGE_PASSWORD,
    method: 'post',
    data: payload
  })
}

async function factor2() {
  return request({
    url: global.endpoint.USERS_ME_FACTOR2,
    method: 'get'
  })
}

async function active2fa(data) {
  return request({
    url: global.endpoint.USERS_ME_FACTOR2_SMART_OTP,
    method: 'put',
    data
  })
}

async function get_account() {
  return request({
    url: global.endpoint.USERS_ME,
    method: 'get',
  })
}

function upload_avatar(data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return otherRequest({
    url: global.endpoint.USERS_ME_UPLOAD_AVATAR,
    method: 'post',
    data: formData
  })
}

export default {
  sign_up,
  update,
  account_info,
  update_account_info,
  change_password,
  factor2,
  active2fa,
  get_account,
  upload_avatar
}
