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

async function get_public_key(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_PUBLIC_KEY.replace(':contact_id', contactId),
    method: 'get',
  })
}

async function update(contactId, data) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS.replace(':contact_id', contactId),
    method: 'put',
    data
  })
}

async function remove(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS.replace(':contact_id', contactId),
    method: 'delete',
  })
}

async function accept(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_ACCEPT.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function confirm(contactId, data) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_CONFIRM.replace(':contact_id', contactId),
    method: 'post',
    data
  })
}

async function initiate(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_INITIATE.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function approve(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_APPROVE.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function reject(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_REJECT.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function invite(data) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_INVITE,
    method: 'post',
    data
  })
}

async function reinvite(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_REINVITE.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function takeover(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_TAKEOVER.replace(':contact_id', contactId),
    method: 'post',
  })
}

async function password(contactId, data) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_PASSWORD.replace(':contact_id', contactId),
    method: 'post',
    data
  })
}

async function view(contactId) {
  return request({
    url: global.endpoint.EMERGENCY_ACCESS_VIEW.replace(':contact_id', contactId),
    method: 'post',
  })
}

export default {
  list_trusted,
  list_granted,
  get_public_key,
  update,
  remove,
  accept,
  confirm,
  initiate,
  approve,
  reject,
  invite,
  reinvite,
  takeover,
  password,
  view
}
