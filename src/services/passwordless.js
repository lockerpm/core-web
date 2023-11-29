import request from '../utils/request'
import global from '../config/global'

function get_credential() {
  return request({
    url: global.endpoint.PASSWORDLESS_CREDENTIAL,
    method: 'get',
  })
}

export default {
  get_credential,
}
