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

async function users_me_violation() {
  return request({
    url: global.endpoint.USERS_ME_VIOLATION,
    method: 'get',
  })
}

async function users_me_block_policy() {
  return request({
    url: global.endpoint.USERS_ME_BLOCK_POLICY,
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

async function users_me_prelogin() {
  return request({
    url: global.endpoint.USERS_ME_PRELOGIN,
    method: 'get',
  })
}

async function users_access_token(token) {
  const deviceId = await common.getDeviceId();
  return request({
    url: global.endpoint.USERS_ACCESS_TOKEN,
    method: 'post',
    data: {
      token: token,
      client_id: global.constants.CLIENT_ID,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: deviceId
    }
  })
}

async function users_session(data = {
  email,
  password,
  hashedPassword,
  kdf,
  kdf_iterations,
  kdf_memory,
  kdf_parallelism
}) {
  global.jsCore.cryptoService.clearKeys();
  let hashedPassword = data?.hashedPassword || null;
  if (data.password) {
    const key = await coreServices.make_key(
      data.email,
      data.password,
      data.kdf,
      data.kdf_iterations,
      data.kdf_memory,
      data.kdf_parallelism
    )
    hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, key)
  }
  const deviceId = await common.getDeviceId();
  return request({
    url: global.endpoint.USERS_SESSION,
    method: "post",
    data: {
      email: data.email,
      client_id: global.constants.CLIENT_ID,
      password: hashedPassword,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: deviceId
    }
  });
}

async function users_session_otp(data = {
  hashedPassword,
  password,
  email,
  method,
  save_device,
  otp,
  kdf,
  kdf_iterations,
  kdf_memory,
  kdf_parallelism,
}) {
  global.jsCore.cryptoService.clearKeys();
  let hashedPassword = data?.hashedPassword || null;
  if (data.password) {
    const key = await coreServices.make_key(
      data.email,
      data.password,
      data.kdf,
      data.kdf_iterations,
      data.kdf_memory,
      data.kdf_parallelism
    )
    hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, key)
  }
  const deviceId = await common.getDeviceId();
  return request({
    url: global.endpoint.USERS_SESSION_OTP,
    method: "post",
    data: {
      email: data.email,
      client_id: global.constants.CLIENT_ID,
      password: hashedPassword,
      device_name: global.jsCore.platformUtilsService.getDeviceString(),
      device_type: global.jsCore.platformUtilsService.getDevice(),
      device_identifier: deviceId,
      method: data.method,
      save_device: data.save_device || false,
      otp: data.otp
    }
  });
}

async function change_password(data = {
  username,
  password_hint,
  login_method,
  password,
  kdf,
  kdf_iterations,
  kdf_memory,
  kdf_parallelism
}, newData = {
  password,
  kdf,
  kdf_iterations,
  kdf_memory,
  kdf_parallelism
}) {
  const makeKey = await coreServices.make_key(
    data.username,
    data.password,
    data.kdf,
    data.kdf_iterations,
    data.kdf_memory,
    data.kdf_parallelism
  )
  const passwordHash = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
  const mewMakeKey = await coreServices.make_key(
    data.username,
    newData.password,
    newData.kdf,
    newData.kdf_iterations,
    newData.kdf_memory,
    newData.kdf_parallelism
  )
  const newPasswordHash = await global.jsCore.cryptoService.hashPassword(newData.password, mewMakeKey);

  let encKey = null
  const existingEncKey = await global.jsCore.cryptoService.getEncKey();
  if (existingEncKey) {
    encKey = await global.jsCore.cryptoService.remakeEncKey(mewMakeKey)
  } else {
    encKey = await global.jsCore.cryptoService.makeEncKey(mewMakeKey)
  }

  const masterPasswordCipher = await common.createEncryptedMasterPw(newData.password, encKey[0])
  const { score } = common.getPasswordStrength(newData.password)

  const payload = {
    score: score,
    login_method: data.login_method,
    key: encKey[1].encryptedString,
    master_password_hash: passwordHash,
    new_master_password_hash: newPasswordHash,
    new_master_password_hint: data.password_hint || undefined,
    master_password_cipher: masterPasswordCipher,
    kdf: newData.kdf,
    kdf_iterations: newData.kdf_iterations,
    kdf_memory: newData.kdf_memory,
    kdf_parallelism: newData.kdf_parallelism
  }
  return request({
    url: global.endpoint.USERS_ME_PASSWORD,
    method: 'post',
    data: payload
  })
}

async function register(data) {
  const makeKey = await coreServices.make_key(
    data.username,
    data.password,
    data.kdf,
    data.kdf_iterations,
    data.kdf_memory,
    data.kdf_parallelism
  )
  const encKey = await global.jsCore.cryptoService.makeEncKey(makeKey)
  const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])
  const hashedPassword = await global.jsCore.cryptoService.hashPassword(data.password, makeKey)
  const { score } = common.getPasswordStrength(data.password)
  let payload = {
    email: data.username,
    kdf: data.kdf,
    kdf_iterations: data.kdf_iterations,
    kdf_memory: data.kdf_memory,
    kdf_parallelism: data.kdf_parallelism,
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
  return request({
    url: global.endpoint.USERS_REGISTER,
    method: "post",
    data: payload
  });
}

async function reset_password(data = {
  username,
  new_password,
  kdf,
  kdf_iterations,
  kdf_memory,
  kdf_parallelism,
  token,
  full_name,
  login_method
}) {
  const mewMakeKey = await coreServices.make_key(
    data.username,
    data.new_password,
    data.kdf,
    data.kdf_iterations,
    data.kdf_memory,
    data.kdf_parallelism
  )
  const newPasswordHash = await global.jsCore.cryptoService.hashPassword(data.new_password, mewMakeKey)
  const encKey = await global.jsCore.cryptoService.makeEncKey(mewMakeKey)
  const keys = await global.jsCore.cryptoService.makeKeyPair(encKey[0])

  const payload = {
    token: data.token,
    full_name: data.full_name,
    login_method: data.login_method,
    new_password: newPasswordHash,
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
  users_me_violation,
  users_me_block_policy,
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
  users_me_prelogin,
  register,
  check_exist_email,
  purge_data,
  reset_password
}
