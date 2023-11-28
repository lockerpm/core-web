import request from "../utils/request"
import global from "../config/global"

function get() {
  return request({
    url: global.endpoint.SSO_CONFIGURATION,
    method: "get",
  })
}

function put(data = {}) {
  return request({
    url: global.endpoint.SSO_CONFIGURATION,
    method: "put",
    data,
  })
}

export default {
  get,
}
