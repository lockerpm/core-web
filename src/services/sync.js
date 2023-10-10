import request from '../utils/request'
import global from '../config/global'

function sync(params = {}) {
  return request({
    url: global.endpoint.SYNC,
    method: 'get',
    params
  })
}

function sync_count() {
  return request({
    url: global.endpoint.SYNC_COUNT,
    method: 'get',
  })
}

function sync_revision_date() {
  return request({
    url: global.endpoint.SYNC_REVISION_DATE,
    method: 'get',
  })
}

export default {
  sync,
  sync_count,
  sync_revision_date
}
