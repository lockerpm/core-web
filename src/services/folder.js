import request from '../utils/request'
import global from '../config/global'

function create(data = {}) {
  return request({
    url: global.endpoint.FOLDERS,
    method: 'post',
    data
  })
}

async function update(id, data = {}) {
  return await request({
    url: global.endpoint.FOLDER.replace(':id', id),
    method: "put",
    data
  });
}

async function remove(id) {
  return await request({
    url: global.endpoint.FOLDER.replace(':id', id),
    method: "delete"
  });
}

export default {
  create,
  update,
  remove,
}
