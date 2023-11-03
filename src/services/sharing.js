import request from '../utils/request'
import global from '../config/global'

function share(data) {
  return request({
    url: global.endpoint.SHARING,
    method: 'put',
    data
  })
}

function sharing_multiple(data) {
  return request({
    url: global.endpoint.SHARING_MULTIPLE,
    method: 'put',
    data
  })
}

function update_sharing(data) {
  return request({
    url: global.endpoint.SHARING,
    method: 'put',
    data
  })
}

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

function stop_sharing_group(organizationId, groupId, data) {
  return request({
    url: global.endpoint.SHARING_GROUP_STOP.replace(':organization_id', organizationId).replace(':group_id', groupId),
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

function add_sharing_group(organizationId, groupId, data) {
  return request({
    url: global.endpoint.SHARING_GROUP.replace(':organization_id', organizationId).replace(':group_id', groupId),
    method: 'post',
    data
  })
}

function update_sharing_group(organizationId, groupId, data) {
  return request({
    url: global.endpoint.SHARING_GROUP.replace(':organization_id', organizationId).replace(':group_id', groupId),
    method: 'put',
    data
  })
}

function update_sharing_member(organizationId, memberId, data) {
  return request({
    url: global.endpoint.SHARING_MEMBER.replace(':organization_id', organizationId).replace(':member_id', memberId),
    method: 'put',
    data
  })
}

function add_sharing_member(organizationId, memberId, data) {
  return request({
    url: global.endpoint.SHARING_MEMBER.replace(':organization_id', organizationId).replace(':member_id', memberId),
    method: 'post',
    data
  })
}

function add_sharing_members(organizationId, data) {
  return request({
    url: global.endpoint.SHARING_MEMBERS.replace(':organization_id', organizationId),
    method: 'post',
    data
  })
}

export default {
  share,
  sharing_multiple,
  update_sharing,
  list_my_shares,
  list_invitations,
  get_public_key,
  stop_sharing,
  stop_sharing_member,
  stop_sharing_group,
  update_sharing_folder,
  update_sharing_folder_items,
  add_sharing_folder_items,
  delete_sharing_folder,
  update_sharing_invitation,
  leave_share,
  add_sharing_group,
  update_sharing_group,
  update_sharing_member,
  add_sharing_member,
  add_sharing_members
}