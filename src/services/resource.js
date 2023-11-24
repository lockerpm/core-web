import request from '../utils/request'
import global from '../config/global'

function get_server_type(params = {}) {
  return request({
    url: global.endpoint.RESOURCES_SERVER_TYPE,
    method: 'get',
    params
  })
}

function list_mail_providers(params = {}) {
  return request({
    url: global.endpoint.RESOURCES_MAIL_PROVIDERS,
    method: 'get',
    params
  })
}

export default {
  get_server_type,
  list_mail_providers,
}
