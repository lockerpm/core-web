import request from "../utils/request"
import global from "../config/global"

function list(enterprise_id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUPS.replace(":enterprise_id", enterprise_id),
    method: "get",
    params
  })
}

function create(enterprise_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUPS.replace(":enterprise_id", enterprise_id),
    method: "post",
    data,
  })
}

function update(enterprise_id, group_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUP.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "put",
    data,
  })
}

function remove(enterprise_id, group_id) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUP.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "delete",
  })
}

function list_users(enterprise_id, group_id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUP_MEMBERS.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "get",
    params
  })
}

function update_users(enterprise_id, group_id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_GROUP_MEMBERS.replace(":enterprise_id", enterprise_id).replace(":group_id", group_id),
    method: "put",
    data
  })
}

export default {
  list,
  create,
  update,
  remove,
  list_users,
  update_users
}
