import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_ACTIVITY.replace(":enterprise_id", enterprise_id),
    method: "get",
    params
  })
}

export default {
  list,
}
