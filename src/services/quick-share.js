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

function access(id) {
  return request({
    url: global.endpoint.QUICK_SHARE_ACCESS.replace(':id', id),
    method: 'get',
  })
}

function submit(id, data) {
  return request({
    url: global.endpoint.QUICK_SHARE_PUBLIC.replace(':id', id),
    method: 'post',
    data
  })
}

function check_access(id, data) {
  return request({
    url: global.endpoint.QUICK_SHARE_ACCESS.replace(':id', id),
    method: 'post',
    data
  })
}

function send_otp(id, data) {
  return request({
    url: global.endpoint.QUICK_SHARE_OTP.replace(':id', id),
    method: 'post',
    data
  })
}

export default {
  list,
  get,
  create,
  stop,
  access,
  submit,
  send_otp,
  check_access
}