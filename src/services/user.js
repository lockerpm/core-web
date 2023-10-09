import request from '../utils/request'

import coreServices from './core'
import authServices from './auth'
import global from '../config/global'

import {
} from '../utils/common'

async function me() {
  return request({
    url: global.endpoint.ME,
    method: 'get',
  })
}

async function users_me() {
  return request({
    url: global.endpoint.USERS_ME,
    method: 'get',
  })
}

async function users_session(data) {
  const deviceId = authServices.device_id();
  global.jsCore.cryptoService.clearKeys();
  const key = await global.jsCore.cryptoService.makeKey(
    data.masterPassword,
    data.email,
    0,
    100000
  )
  const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.masterPassword, key)
  return await request({
    url: global.endpoint.USERS_SESSION,
    method: "post",
    data: {
      client_id: global.constants.CLIENT_ID,
      password: hashedPassword,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: deviceId
    }
  });
}

async function change_password(data = {}) {
  const storedKeyHash = await global.jsCore.cryptoService.getKeyHash() || null

  const oldMakeKey = data.password ? await coreServices.make_key(data.username, data.password) : null
  const password = data.password ? await global.jsCore.cryptoService.hashPassword(data.password, oldMakeKey) : storedKeyHash

  const makeKey = await coreServices.make_key(data.username, data.new_password)
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

export default {
  me,
  users_me,
  users_session,
  change_password,
}
