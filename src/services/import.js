import request from '../utils/request'
import global from '../config/global'

function import_folders(data = {}) {
  return request({
    url: global.endpoint.IMPORT_FOLDERS,
    method: 'post',
    data
  })
}

async function import_ciphers(data = {}) {
  return await request({
    url: global.endpoint.IMPORT_CIPHERS,
    method: "post",
    data
  });
}

export default {
  import_folders,
  import_ciphers,
}
