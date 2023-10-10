import request from '../utils/request'
import global from '../config/global'

function create_cipher(data = {}) {
  return request({
    url: global.endpoint.CIPHERS_VAULTS,
    method: 'post',
    params
  })
}

async function update_cipher(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER.replace(':id', id),
    method: "put",
    data
  });
}

async function use_cipher(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER_USE.replace(':id', id),
    method: "put",
    data
  });
}

async function share_cipher(id, data = {}) {
  return await request({
    url: global.endpoint.CIPHER_SHARE.replace(':id', id),
    method: "put",
    data
  });
}

async function delete_ciphers(data = {}) {
  return await request({
    url: global.endpoint.CIPHERS_DELETE,
    method: "put",
    data
  });
}

async function restore_ciphers(data = {}) {
  return await request({
    url: global.endpoint.CIPHERS_RESTORE,
    method: "put",
    data
  });
}

function move_ciphers(data) {
  return request({
    url: global.endpoint.CIPHERS_MOVE,
    method: 'put',
    data
  })
}

function permanent_delete_ciphers(data) {
  return request({
    url: global.endpoint.CIPHERS_PERMANENT_DELETE,
    method: 'put',
    data
  })
}

export default {
  create_cipher,
  update_cipher,
  use_cipher,
  share_cipher,
  delete_ciphers,
  restore_ciphers,
  move_ciphers,
  permanent_delete_ciphers
}
