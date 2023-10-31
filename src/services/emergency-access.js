import request from '../utils/request'
import global from '../config/global'

function list_trusted() {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_TRUSTED,
    method: 'get',
  })
}

async function list_granted() {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_GRANTED,
    method: 'get',
  })
}

export default {
  list_trusted,
  list_granted,
}
