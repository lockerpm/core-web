import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBERS.replace(":enterprise_id", enterprise_id),
    method: "get",
    params
  })
}

function create_members(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_ADD_MEMBERS.replace(":enterprise_id", enterprise_id),
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

function activated(enterprise_id, member_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBER_ACTIVATED.replace(":enterprise_id", enterprise_id).replace(":member_id", member_id),
    method: "put",
    data,
  })
}

function reinvite(enterprise_id, member_id) {
  return request({
    url: global.endpoint.ENTERPRISE_MEMBER_REINVITE.replace(":enterprise_id", enterprise_id).replace(":member_id", member_id),
    method: "post",
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
  create_members,
  update,
  activated,
  reinvite,
  remove,
}
