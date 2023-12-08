import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_POLICY.replace(":enterprise_id", enterprise_id),
    method: "get",
    params
  })
}

function password_requirement(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_POLICY_PASSWORD_REQUIREMENT.replace(":enterprise_id", enterprise_id),
    method: "put",
    data
  })
}

function block_failed_login(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_POLICY_BLOCK_FAILED_LOGIN.replace(":enterprise_id", enterprise_id),
    method: "put",
    data
  })
}

function passwordless(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_POLICY_PASSWORD_PASSWORLESS.replace(":enterprise_id", enterprise_id),
    method: "put",
    data
  })
}

function two_fa(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_POLICY_PASSWORD_2FA.replace(":enterprise_id", enterprise_id),
    method: "put",
    data
  })
}

export default {
  list,
  password_requirement,
  block_failed_login,
  passwordless,
  two_fa
}
