import request from '../utils/request'
import global from '../config/global'

function create(data = {}) {
  return request({
    url: global.endpoint.CIPHERS_VAULTS,
    method: 'post',
    data
  })
}

async function update(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER.replace(':id', id),
    method: "put",
    data
  });
}

async function use(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER_USE.replace(':id', id),
    method: "put",
    data
  });
}

async function share(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER_SHARE.replace(':id', id),
    method: "put",
    data
  });
}

async function restore(data = {}) {
  return await request({
    url: global.endpoint.CIPHERS_RESTORE,
    method: "put",
    data
  });
}

function move(data) {
  return request({
    url: global.endpoint.CIPHERS_MOVE,
    method: 'put',
    data
  })
}

async function multiple_delete(data = {}) {
  return await request({
    url: global.endpoint.CIPHERS_DELETE,
    method: "put",
    data
  });
}

function permanent_delete(data) {
  return request({
    url: global.endpoint.CIPHERS_PERMANENT_DELETE,
    method: 'put',
    data
  })
}

export default {
  create,
  update,
  use,
  share,
  restore,
  move,
  multiple_delete,
  permanent_delete
}
