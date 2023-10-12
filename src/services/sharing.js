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

export default {
  list_my_shares,
  list_invitations,
}