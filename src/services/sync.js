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

function sync_profile() {
  return request({
    url: global.endpoint.SYNC_PROFILE,
    method: 'get',
  })
}

function sync_folders() {
  return request({
    url: global.endpoint.SYNC_FOLDERS,
    method: 'get',
  })
}

function sync_policies() {
  return request({
    url: global.endpoint.SYNC_POLICIES,
    method: 'get',
  })
}

function sync_collections() {
  return request({
    url: global.endpoint.SYNC_COLLECTIONS,
    method: 'get',
  })
}

function sync_cipher(id) {
  return request({
    url: global.endpoint.SYNC_CIPHER.replace(':id', id),
    method: 'get',
  })
}

function sync_folder(id) {
  return request({
    url: global.endpoint.SYNC_FOLDER.replace(':id', id),
    method: 'get',
  })
}

function sync_collection(id) {
  return request({
    url: global.endpoint.SYNC_FOLDER.replace(':id', id),
    method: 'get',
  })
}

export default {
  sync,
  sync_count,
  sync_profile,
  sync_folders,
  sync_policies,
  sync_collections,
  sync_cipher,
  sync_folder,
  sync_collection,
}
