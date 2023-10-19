import request from '../utils/request'
import global from '../config/global'

function list_my_shares(params = { paging: 0 }) {
  return request({
    url: global.endpoint.SHARING_MY_SHARE,
    method: 'get',
    params
  })
}

function list_invitations() {
  return request({
    url: global.endpoint.SHARING_INVITATIONS,
    method: 'get',
  })
}

function stop_sharing(organizationId, data) {
  return request({
    url: global.endpoint.SHARING_STOP.replace(':organization_id', organizationId),
    method: 'post',
    data
  })
}

function stop_sharing_member(organizationId, memberId, data) {
  return request({
    url: global.endpoint.SHARING_MEMBER_STOP.replace(':organization_id', organizationId).replace(':member_id', memberId),
    method: 'post',
    data
  })
}

export default {
  list_my_shares,
  list_invitations,
  stop_sharing,
  stop_sharing_member,
}