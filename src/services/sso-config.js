import request from "../utils/request"
import global from "../config/global"

function get() {
  return request({
    url: global.endpoint.SSO_CONFIGURATION,
    method: "get",
  })
}

function update(data) {
  return request({
    url: global.endpoint.SSO_CONFIGURATION,
    method: "put",
    data
  })
}

function check_exists() {
  return request({
    url: global.endpoint.SSO_CONFIGURATION_CHECK_EXISTS,
    method: "get",
  })
}

function get_user_by_code(data) {
  return request({
    url: global.endpoint.SSO_CONFIGURATION_GET_USER,
    method: "post",
    data
  })
}

export default {
  get,
  update,
  check_exists,
  get_user_by_code
}
