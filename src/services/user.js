import request from '../utils/request'

import coreServices from './core'

import global from '../config/global'
import common from '../utils/common'

async function users_me() {
  return request({
    url: global.endpoint.USERS_ME,
    method: 'get',
  })
}

async function update_users_me(data = {}) {
  return request({
    url: global.endpoint.USERS_ME,
    method: 'put',
    data
  })
}

async function users_me_devices() {
  return request({
    url: global.endpoint.USERS_ME_DEVICES,
    method: 'get',
  })
}

async function remove_device(deviceId) {
  return request({
    url: global.endpoint.USERS_ME_DEVICE.replace(':device_id', deviceId),
    method: 'delete',
  })
}

async function revoke_all_devices(hashedPassword) {
  return request({
    url: global.endpoint.USERS_SESSION_REVOKE_ALL,
    method: 'post',
    data: {
      master_password_hash: hashedPassword
    }
  })
}

async function on_premise_prelogin(data) {
  return request({
    url: global.endpoint.USERS_ON_PREMISE_PRELOGIN,
    method: 'post',
    data
  })
}

async function check_exist_email(data) {
  return request({
    url: global.endpoint.USERS_EXIST,
    method: 'post',
    data
  })
}

async function purge_data(data) {
  return request({
    url: global.endpoint.USERS_ME_PURGE,
    method: 'post',
    data
  })
}

async function check_exist() {
  return request({
    url: global.endpoint.USERS_EXIST,
    method: 'get',
  });
}

async function users_prelogin(data) {
  return request({
    url: global.endpoint.USERS_PRELOGIN,
    method: 'post',
    data
  })
}

async function users_access_token(token) {
  return request({
    url: global.endpoint.USERS_ACCESS_TOKEN,
    method: 'post',
    data: {
      token: token,
      client_id: global.constants.CLIENT_ID,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: common.deviceId()
    }
  })
}

async function users_session(data) {
  global.jsCore.cryptoService.clearKeys();
  let hashedPassword = data?.hashedPassword || null;
  if (data.password) {
    const key = await coreServices.make_key(data.email, data.password)
    hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, key)
  }
  return await request({
    url: global.endpoint.USERS_SESSION,
    method: "post",
    data: {
      email: data.email,
      client_id: global.constants.CLIENT_ID,
      password: hashedPassword,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: common.deviceId()
    }
  });
}

async function users_session_otp(data) {
  global.jsCore.cryptoService.clearKeys();
  let hashedPassword = data?.hashedPassword || null;
  if (data.password) {
    const key = await coreServices.make_key(data.email, data.password)
    hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, key)
  }
  return await request({
    url: global.endpoint.USERS_SESSION_OTP,
    method: "post",
    data: {
      email: data.email,
      client_id: global.constants.CLIENT_ID,
      password: hashedPassword,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: common.deviceId(),
      method: data.method,
      save_device: data.save_device || false,
      otp: data.otp
    }
  });
}

async function change_password(data = {}) {
  const makeKey = await coreServices.make_key(data.username, data.password)
  const password = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)

  const mewMakeKey = await coreServices.make_key(data.username, data.new_password)
  const newPassword = await global.jsCore.cryptoService.hashPassword(data.new_password, mewMakeKey)


  let encKey = null
  const existingEncKey = await global.jsCore.cryptoService.getEncKey();
  if (existingEncKey) {
    encKey = await global.jsCore.cryptoService.remakeEncKey(mewMakeKey)
  } else {
    encKey = await global.jsCore.cryptoService.makeEncKey(mewMakeKey)
  }

  const masterPasswordCipher = await common.createEncryptedMasterPw(newPassword)
  const { score } = common.getPasswordStrength(data.new_password)

  const payload = {
    key: encKey[1].encryptedString,
    master_password_hash: password,
    new_master_password_hash: newPassword,
    new_master_password_hint: data.password_hint || '',
    score: score,
    master_password_cipher: masterPasswordCipher,
    login_method: data.login_method
  }

  return request({
    url: global.endpoint.USERS_ME_PASSWORD,
    method: 'post',
    data: payload
  })
}

async function register(data) {
  const makeKey = await coreServices.make_key(data.username, data.password)
  const encKey = await global.jsCore.cryptoService.makeEncKey(makeKey)
  const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])
  const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
  const { score } = common.getPasswordStrength(data.password)
  let payload = {
    email: data.username,
    kdf: global.constants.CORE_JS_INFO.KDF,
    kdf_iterations: global.constants.CORE_JS_INFO.KDF_ITERATIONS,
    master_password_hash: hashedPassword,
    master_password_hint: data.password_hint || "",
    key: encKey[1].encryptedString,
    keys: {
      public_key: keys[0],
      encrypted_private_key: keys[1].encryptedString,
    },
    score: score,
    trial_plan: null,
    is_trial_promotion: false,
    enterprise_name: null
  }
  return await request({
    url: global.endpoint.USERS_REGISTER,
    method: "post",
    data: payload
  });
}

async function reset_password(data = {}) {
  const mewMakeKey = await coreServices.make_key(data.username, data.new_password)
  const newPassword = await global.jsCore.cryptoService.hashPassword(data.new_password, mewMakeKey)
  const encKey = await global.jsCore.cryptoService.makeEncKey(mewMakeKey)
  const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])

  const payload = {
    token: data.token,
    full_name: data.full_name,
    login_method: data.login_method,
    new_password: newPassword,
    new_key: encKey[1].encryptedString,
    keys: {
      public_key: keys[0],
      encrypted_private_key: keys[1].encryptedString,
    },
  }

  return request({
    url: global.endpoint.USERS_RESET_PASSWORD,
    method: 'post',
    data: payload
  })
}

export default {
  users_me,
  update_users_me,
  users_me_devices,
  remove_device,
  users_access_token,
  users_session,
  users_session_otp,
  change_password,
  revoke_all_devices,
  on_premise_prelogin,
  check_exist,
  users_prelogin,
  register,
  check_exist_email,
  purge_data,
  reset_password
}
