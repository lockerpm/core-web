import request from '../utils/request'
import global from '../config/global'

function breach(data = {}) {
  return request({
    url: global.endpoint.TOOLS_BREACH,
    method: 'post',
    data
  })
}

export default {
  breach,
}
