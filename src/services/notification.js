import request from '../utils/request'
import global from '../config/global'

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
  list_settings,
  update_setting,
}
