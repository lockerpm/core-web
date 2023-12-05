import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id) {
  return request({
    url: global.endpoint.COMPANY_GROUPS.replace(":enterprise_id", enterprise_id),
    method: "get",
  })
}

function create(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.COMPANY_GROUPS.replace(":enterprise_id", enterprise_id),
    method: "post",
    data,
  })
}

function update(enterprise_id, group_id, data = {}) {
  return request({
    url: global.endpoint.COMPANY_GROUP.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "put",
    data,
  })
}

function remove(enterprise_id, group_id) {
  return request({
    url: global.endpoint.COMPANY_GROUP.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "delete",
  })
}

export default {
  list,
  create,
  update,
  remove,
}