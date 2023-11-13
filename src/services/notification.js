import request from '../utils/request'
import global from '../config/global'

function list(params = {}) {
  return request({
    url: global.endpoint.NOTIFICATIONS,
    method: 'get',
    params
  })
}

function update(id, data = {}) {
  return request({
    url: global.endpoint.NOTIFICATION.replace(':notification_id', id),
    method: 'put',
    data
  })
}

function read_all(params = {}) {
  return request({
    url: global.endpoint.NOTIFICATIONS_READ_ALL,
    method: 'get',
    params
  })
}

function list_settings(params = {}) {
  return request({
    url: global.endpoint.NOTIFICATION_SETTINGS,
    method: 'get',
    params
  })
}

async function update_setting(id, data = {}) {
  return await request({
    url: global.endpoint.NOTIFICATION_SETTING.replace(':setting_id', id),
    method: "put",
    data
  });
}

export default {
  list,
  update,
  read_all,
  list_settings,
  update_setting,
}
