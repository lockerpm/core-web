import request from '../utils/request'
import global from '../config/global'

function list_teams(params = {}) {
  return request({
    url: global.endpoint.ENTERPRISES,
    method: 'get',
    params
  })
}

function list_groups_members(organizationId, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISES_MEMBERS_GROUPS_SEARCH.replace(':organization_id', organizationId),
    method: 'post',
    data
  })
}

function list_user_group_members(groupId) {
  return request({
    url: global.endpoint.ENTERPRISES_USER_GROUP_MEMBERS.replace(':group_id', groupId),
    method: 'get',
  })
}

function list() {
  return request({
    url: global.endpoint.ADMIN_ENTERPRISES,
    method: "get",
  })
}

function get(id) {
  return request({
    url: global.endpoint.ENTERPRISE.replace(":enterprise_id", id),
    method: "get",
  })
}

function dashboard(id, params = {}) {
  return request({
    url: global.endpoint.ENTERPRISE_DASHBOARD.replace(":enterprise_id", id),
    method: "get",
    params
  })
}

function create(data = {}) {
  return request({
    url: global.endpoint.ADMIN_ENTERPRISES,
    method: "post",
    data,
  })
}

function update(id, data = {}) {
  return request({
    url: global.endpoint.ENTERPRISE.replace(":enterprise_id", id),
    method: "put",
    data
  })
}

function remove(id) {
  return request({
    url: global.endpoint.ENTERPRISE.replace(":enterprise_id", id),
    method: "delete",
  })
}

export default {
  list_teams,
  list_groups_members,
  list_user_group_members,
  list,
  get,
  dashboard,
  create,
  update,
  remove
}
