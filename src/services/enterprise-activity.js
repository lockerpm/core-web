import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id) {
  return request({
    url: global.endpoint.ENTERPRISE_ACTIVITY.replace(":enterprise_id", enterprise_id),
    method: "get",
  })
}

export default {
  list,
}
