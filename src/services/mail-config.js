import request from '../utils/request'
import global from '../config/global'

function get(params = {}) {
  return request({
    url: global.endpoint.MAIL_CONFIGURATION,
    method: 'get',
    params
  })
}

function update(data = {}) {
  return request({
    url: global.endpoint.MAIL_CONFIGURATION,
    method: 'put',
    data
  })
}

function remove() {
  return request({
    url: global.endpoint.MAIL_CONFIGURATION,
    method: 'delete',
  })
}

function send_test(data = {}) {
  return request({
    url: global.endpoint.MAIL_CONFIGURATION_TEST,
    method: 'post',
    data
  })
}

export default {
  get,
  update,
  remove,
  send_test
}
