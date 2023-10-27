import request from '../utils/request'
import global from '../config/global'

function list(params = { paging: 0 }) {
  return request({
    url: global.endpoint.QUICK_SHARES,
    method: 'get',
    params
  })
}

function get(id) {
  return request({
    url: global.endpoint.QUICK_SHARE.replace(':id', id),
    method: 'get',
  })
}

function create(data) {
  return request({
    url: global.endpoint.QUICK_SHARES,
    method: 'post',
    data
  })
}

function stop(id) {
  return request({
    url: global.endpoint.QUICK_SHARE.replace(':id', id),
    method: 'delete',
  })
}

export default {
  list,
  get,
  create,
  stop
}