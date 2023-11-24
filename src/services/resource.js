import request from '../utils/request'
import global from '../config/global'

function list_mail_providers(params = {}) {
  return request({
    url: global.endpoint.RESOURCES_MAIL_PROVIDERS,
    method: 'get',
    params
  })
}

export default {
  list_mail_providers,
}
