import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBERS.replace(":enterprise_id", enterprise_id),
    method: "get",
  })
}

function create(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBERS.replace(":enterprise_id", enterprise_id),
    method: "post",
    data,
  })
}

function update(enterprise_id, member_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBER.replace(":enterprise_id", enterprise_id).replace(":member_id", member_id),
    method: "put",
    data,
  })
}

function remove(enterprise_id, member_id) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBER.replace(":enterprise_id", enterprise_id).replace(":member_id", member_id),
    method: "delete",
  })
}

export default {
  list,
  create,
  update,
  remove,
}
