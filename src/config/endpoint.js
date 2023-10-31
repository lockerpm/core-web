const API_URL = process.env.REACT_APP_API_URL
const WS_URL = process.env.REACT_APP_WS_URL

const FLAT_FORM = `${API_URL}/v3/cystack_platform/pm`
const WS_FLAT_FORM = `${WS_URL}/cystack_platform/pm`

export default {
  ME: `${API_URL}/v3/sso/me`,

  AUTH: `${API_URL}/v3/sso/auth`,
  AUTH_METHOD: `${API_URL}/v3/sso/auth/method`,
  AUTH_OTP: `${API_URL}/v3/sso/auth/otp`,
  ACCESS_TOKEN: `${API_URL}/v3/sso/access_token`,

  LOGOUT: `${API_URL}/v3/users/logout`,

  USERS_ME: `${FLAT_FORM}/users/me`,
  USERS_ME_DEVICES: `${FLAT_FORM}/users/me/devices`,
  USERS_SESSION: `${FLAT_FORM}/users/session`,

  WS_SYNC: `${WS_FLAT_FORM}/sync`,

  SYNC: `${FLAT_FORM}/sync`,
  SYNC_COUNT: `${FLAT_FORM}/sync/count`,
  SYNC_PROFILE: `${FLAT_FORM}/sync/profile`,
  SYNC_FOLDERS: `${FLAT_FORM}/sync/folders`,
  SYNC_POLICIES: `${FLAT_FORM}/sync/policies`,
  SYNC_COLLECTIONS: `${FLAT_FORM}/sync/collections`,
  SYNC_CIPHER: `${FLAT_FORM}/sync/ciphers/:id`,
  SYNC_FOLDER: `${FLAT_FORM}/sync/folders/:id`,
  SYNC_COLLECTION: `${FLAT_FORM}/sync/collections/:id`,

  SHARING: `${FLAT_FORM}/sharing`,
  SHARING_MULTIPLE: `${FLAT_FORM}/sharing/multiple`,
  SHARING_MY_SHARE: `${FLAT_FORM}/sharing/my_share`,
  SHARING_PUBLIC_KEY: `${FLAT_FORM}/sharing/public_key`,
  SHARING_INVITATIONS: `${FLAT_FORM}/sharing/invitations`,
  SHARING_INVITATION: `${FLAT_FORM}/sharing/invitations/:invitation_id`,
  SHARING_STOP: `${FLAT_FORM}/sharing/:organization_id/stop`,
  SHARING_LEAVE: `${FLAT_FORM}/sharing/:organization_id/leave`,
  SHARING_MEMBERS: `${FLAT_FORM}/sharing/:organization_id/members`,
  SHARING_MEMBER: `${FLAT_FORM}/sharing/:organization_id/members/:member_id`,
  SHARING_MEMBER_STOP: `${FLAT_FORM}/sharing/:organization_id/members/:member_id/stop`,
  SHARING_GROUPS: `${FLAT_FORM}/sharing/:organization_id/groups`,
  SHARING_GROUP: `${FLAT_FORM}/sharing/:organization_id/groups/:group_id`,
  SHARING_GROUP_STOP: `${FLAT_FORM}/sharing/:organization_id/groups/:group_id/stop`,
  SHARING_FOLDERS: `${FLAT_FORM}/sharing/:organization_id/folders`,
  SHARING_FOLDER: `${FLAT_FORM}/sharing/:organization_id/folders/:folder_id`,
  SHARING_FOLDER_ITEMS: `${FLAT_FORM}/sharing/:organization_id/folders/:folder_id/items`,
  SHARING_FOLDER_DELETE: `${FLAT_FORM}/sharing/:organization_id/folders/:folder_id/delete`,

  QUICK_SHARES: `${FLAT_FORM}/quick_shares`,
  QUICK_SHARE: `${FLAT_FORM}/quick_shares/:id`,

  CIPHER: `${FLAT_FORM}/ciphers/:id`,
  CIPHER_USE: `${FLAT_FORM}/ciphers/:id/use`,
  CIPHER_SHARE: `${FLAT_FORM}/ciphers/:id/share`,
  CIPHERS_VAULTS: `${FLAT_FORM}/ciphers/vaults`,
  CIPHERS_DELETE: `${FLAT_FORM}/ciphers/delete`,
  CIPHERS_RESTORE: `${FLAT_FORM}/ciphers/restore`,
  CIPHERS_MOVE: `${FLAT_FORM}/ciphers/move`,
  CIPHERS_PERMANENT_DELETE: `${FLAT_FORM}/ciphers/permanent_delete`,

  FOLDERS:  `${FLAT_FORM}/folders`,
  FOLDER: `${FLAT_FORM}/folders/:id`,

  ENTERPRISES: `${FLAT_FORM}/enterprises`,
  ENTERPRISES_USER_GROUP_MEMBERS: `${FLAT_FORM}/enterprises/user_groups/:group_id/members`,
  ENTERPRISES_MEMBERS_GROUPS_SEARCH: `${FLAT_FORM}/enterprises/:organization_id/members_groups/search`,

  NOTIFICATION_SETTINGS: `${FLAT_FORM}/notification/settings`,
  NOTIFICATION_SETTING: `${FLAT_FORM}/notification/settings/:setting_id`,

  EMERGENCY_ACCESS_TRUSTED: `${FLAT_FORM}/emergency_access/trusted`,
  EMERGENCY_ACCESS_GRANTED: `${FLAT_FORM}/emergency_access/granted`,
}