import request from '../utils/request'
import global from '../config/global'

function sync(params = {}) {
  return request({
    url: global.endpoint.SYNC,
    method: 'get',
    params
  })
}

function sync_statistic() {
  return request({
    url: global.endpoint.SYNC_STATISTIC,
    method: 'get',
  })
}


function sync_profile_data() {
  return request({
    url: global.endpoint.SYNC_PROFILE_DATA,
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
  sync_statistic,
  sync_profile_data,
  sync_revision_date
}
