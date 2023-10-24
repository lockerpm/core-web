import request from '../utils/request'
import global from '../config/global'

function list_my_shares(params = { paging: 0 }) {
  return request({
    url: global.endpoint.SHARING_MY_SHARE,
    method: 'get',
    params
  })
}

function list_invitations() {
  return request({
    url: global.endpoint.SHARING_INVITATIONS,
    method: 'get',
  })
}

function get_public_key(data) {
  return request({
    url: global.endpoint.SHARING_PUBLIC_KEY,
    method: 'post',
    data
  })
}

function stop_sharing(organizationId, data) {
  return request({
    url: global.endpoint.SHARING_STOP.replace(':organization_id', organizationId),
    method: 'post',
    data
  })
}

function stop_sharing_member(organizationId, memberId, data) {
  return request({
    url: global.endpoint.SHARING_MEMBER_STOP.replace(':organization_id', organizationId).replace(':member_id', memberId),
    method: 'post',
    data
  })
}

function update_sharing_folder(organizationId, folderId, data) {
  return request({
    url: global.endpoint.SHARING_FOLDER.replace(':organization_id', organizationId).replace(':folder_id', folderId),
    method: 'put',
    data
  })
}

function update_sharing_folder_items(organizationId, folderId, data) {
  return request({
    url: global.endpoint.SHARING_FOLDER_ITEMS.replace(':organization_id', organizationId).replace(':folder_id', folderId),
    method: 'put',
    data
  })
}

function add_sharing_folder_items(organizationId, folderId, data) {
  return request({
    url: global.endpoint.SHARING_FOLDER_ITEMS.replace(':organization_id', organizationId).replace(':folder_id', folderId),
    method: 'post',
    data
  })
}

function delete_sharing_folder(organizationId, folderId, data) {
  return request({
    url: global.endpoint.SHARING_FOLDER_DELETE.replace(':organization_id', organizationId).replace(':folder_id', folderId),
    method: 'post',
    data
  })
}

function update_sharing_invitation(invitationId, data) {
  return request({
    url: global.endpoint.SHARING_INVITATION.replace(':invitation_id', invitationId),
    method: 'put',
    data
  })
}

function leave_share(organizationId) {
  return request({
    url: global.endpoint.SHARING_LEAVE.replace(':organization_id', organizationId),
    method: 'post',
  })
}

export default {
  list_my_shares,
  list_invitations,
  get_public_key,
  stop_sharing,
  stop_sharing_member,
  update_sharing_folder,
  update_sharing_folder_items,
  add_sharing_folder_items,
  delete_sharing_folder,
  update_sharing_invitation,
  leave_share
}