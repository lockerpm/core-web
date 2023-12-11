import request from "../utils/request"
import global from "../config/global"

function get() {
  return request({
    url: global.endpoint.SSO_CONFIGURATION,
    method: "get",
  })
}

function check_exists() {
  return request({
    url: global.endpoint.SSO_CONFIGURATION_CHECK_EXISTS,
    method: "get",
  })
}

export default {
  get,
  check_exists
}
