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

export default {
  list_teams,
  list_groups_members,
  list_user_group_members
}
