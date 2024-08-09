const API_URL = process.env.REACT_APP_API_URL
const WS_URL = process.env.REACT_APP_WS_URL

const FLAT_FORM = `${API_URL}/v3/cystack_platform/pm`
const ADMIN = `${API_URL}/admin`
const WS_FLAT_FORM = `${WS_URL}/cystack_platform/pm`

export default {
  WS_SYNC: `${WS_FLAT_FORM}/sync`,

  SSO_AUTH_OTP: `${API_URL}/v3/sso/auth/otp`,
  SSO_ME_FACTOR2: `${API_URL}/v3/sso/me/factor2`,
  SSO_ME_FACTOR2_ACTIVATE: `${API_URL}/v3/sso/me/factor2/activate`,
  SSO_ME_FACTOR2_ACTIVATE_CODE: `${API_URL}/v3/sso/me/factor2/activate_code`,

  LOGOUT: `${API_URL}/v3/users/logout`,
  EXIST: `${API_URL}/v3/users/exist`,

  RESOURCES_SERVER_TYPE: `${API_URL}/v3/resources/server_type`,
  RESOURCES_MAIL_PROVIDERS: `${FLAT_FORM}/resources/mail_providers`,

  USERS_ME: `${FLAT_FORM}/users/me`,
  USERS_ME_VIOLATION: `${FLAT_FORM}/users/me/violation`,
  USERS_ME_BLOCK_POLICY: `${FLAT_FORM}/users/me/block_policy`,
  USERS_EXIST: `${FLAT_FORM}/users/exist`,
  USERS_ACCESS_TOKEN: `${FLAT_FORM}/users/access_token`,
  USERS_SESSION: `${FLAT_FORM}/users/session`,
  USERS_SESSION_OTP: `${FLAT_FORM}/users/session/otp`,
  USERS_PRELOGIN: `${FLAT_FORM}/users/prelogin`,
  USERS_REGISTER: `${FLAT_FORM}/users/register`,
  USERS_RESET_PASSWORD: `${FLAT_FORM}/users/reset_password`,
  USERS_ME_PURGE: `${FLAT_FORM}/users/me/purge`,
  USERS_ME_DEVICES: `${FLAT_FORM}/users/me/devices`,
  USERS_ME_PASSWORD: `${FLAT_FORM}/users/me/password`,
  USERS_ME_BLOCK_BY_2FA: `${FLAT_FORM}/users/me/block_by_2fa`,
  USERS_ME_DEVICE: `${FLAT_FORM}/users/me/devices/:device_id`,
  USERS_SESSION_REVOKE_ALL: `${FLAT_FORM}/users/session/revoke_all`,
  USERS_ON_PREMISE_PRELOGIN: `${FLAT_FORM}/onpremise/prelogin`,

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
  QUICK_SHARE_ACCESS: `${FLAT_FORM}/quick_shares/:id/access`,
  QUICK_SHARE_PUBLIC: `${FLAT_FORM}/quick_shares/:id/public`,
  QUICK_SHARE_OTP: `${FLAT_FORM}/quick_shares/:id/otp`,

  CIPHER: `${FLAT_FORM}/ciphers/:id`,
  CIPHER_USE: `${FLAT_FORM}/ciphers/:id/use`,
  CIPHER_SHARE: `${FLAT_FORM}/ciphers/:id/share`,
  CIPHERS_VAULTS: `${FLAT_FORM}/ciphers/vaults`,
  CIPHERS_DELETE: `${FLAT_FORM}/ciphers/delete`,
  CIPHERS_RESTORE: `${FLAT_FORM}/ciphers/restore`,
  CIPHERS_MOVE: `${FLAT_FORM}/ciphers/move`,
  CIPHERS_PERMANENT_DELETE: `${FLAT_FORM}/ciphers/permanent_delete`,

  FOLDERS: `${FLAT_FORM}/folders`,
  FOLDER: `${FLAT_FORM}/folders/:id`,

  NOTIFICATIONS: `${API_URL}/v3/notifications`,
  NOTIFICATION: `${API_URL}/v3/notifications/:notification_id`,
  NOTIFICATIONS_READ_ALL: `${API_URL}/v3/notifications/read_all`,
  NOTIFICATION_SETTINGS: `${FLAT_FORM}/notification/settings`,
  NOTIFICATION_SETTING: `${FLAT_FORM}/notification/settings/:setting_id`,

  EMERGENCY_ACCESS_TRUSTED: `${FLAT_FORM}/emergency_access/trusted`,
  EMERGENCY_ACCESS_GRANTED: `${FLAT_FORM}/emergency_access/granted`,
  EMERGENCY_ACCESS: `${FLAT_FORM}/emergency_access/:contact_id`,
  EMERGENCY_ACCESS_ACCEPT: `${FLAT_FORM}/emergency_access/:contact_id/accept`,
  EMERGENCY_ACCESS_PUBLIC_KEY: `${FLAT_FORM}/emergency_access/:contact_id/public_key`,
  EMERGENCY_ACCESS_CONFIRM: `${FLAT_FORM}/emergency_access/:contact_id/confirm`,
  EMERGENCY_ACCESS_INITIATE: `${FLAT_FORM}/emergency_access/:contact_id/initiate`,
  EMERGENCY_ACCESS_APPROVE: `${FLAT_FORM}/emergency_access/:contact_id/approve`,
  EMERGENCY_ACCESS_REJECT: `${FLAT_FORM}/emergency_access/:contact_id/reject`,
  EMERGENCY_ACCESS_INVITE: `${FLAT_FORM}/emergency_access/invite`,
  EMERGENCY_ACCESS_REINVITE: `${FLAT_FORM}/emergency_access/:contact_id/reinvite`,
  EMERGENCY_ACCESS_TAKEOVER: `${FLAT_FORM}/emergency_access/:contact_id/takeover`,
  EMERGENCY_ACCESS_PASSWORD: `${FLAT_FORM}/emergency_access/:contact_id/password`,
  EMERGENCY_ACCESS_VIEW: `${FLAT_FORM}/emergency_access/:contact_id/view`,

  IMPORT_FOLDERS: `${FLAT_FORM}/import/folders`,
  IMPORT_CIPHERS: `${FLAT_FORM}/import/ciphers`,

  TOOLS_BREACH: `${FLAT_FORM}/tools/breach`,

  PASSWORDLESS_CREDENTIAL: `${FLAT_FORM}/passwordless/credential`,

  ENTERPRISES: `${FLAT_FORM}/enterprises`,
  ENTERPRISE: `${FLAT_FORM}/enterprises/:enterprise_id`,
  ENTERPRISE_DASHBOARD: `${FLAT_FORM}/enterprises/:enterprise_id/dashboard`,

  ENTERPRISE_GROUPS: `${FLAT_FORM}/enterprises/:enterprise_id/groups`,
  ENTERPRISE_GROUP: `${FLAT_FORM}/enterprises/:enterprise_id/groups/:group_id`,
  ENTERPRISE_GROUP_MEMBERS: `${FLAT_FORM}/enterprises/:enterprise_id/groups/:group_id/members`,

  ENTERPRISE_MEMBERS: `${FLAT_FORM}/enterprises/:enterprise_id/members`,
  ENTERPRISE_ADD_MEMBERS: `${FLAT_FORM}/enterprises/:enterprise_id/add_members`,
  ENTERPRISE_MEMBER: `${FLAT_FORM}/enterprises/:enterprise_id/members/:member_id`,
  ENTERPRISE_MEMBER_REINVITE: `${FLAT_FORM}/enterprises/:enterprise_id/members/:member_id/reinvite`,
  ENTERPRISE_MEMBER_ACTIVATED: `${FLAT_FORM}/enterprises/:enterprise_id/members/:member_id/activated`,

  ENTERPRISES_USER_GROUP_MEMBERS: `${FLAT_FORM}/enterprises/user_groups/:group_id/members`,
  ENTERPRISES_MEMBERS_GROUPS_SEARCH: `${FLAT_FORM}/enterprises/:organization_id/members_groups/search`,
  ENTERPRISE_ACTIVITY: `${FLAT_FORM}/enterprises/:enterprise_id/activity`,

  ENTERPRISE_POLICY: `${FLAT_FORM}/enterprises/:enterprise_id/policy`,
  ENTERPRISE_POLICY_PASSWORD_REQUIREMENT: `${FLAT_FORM}/enterprises/:enterprise_id/policy/password_requirement`,
  ENTERPRISE_POLICY_BLOCK_FAILED_LOGIN: `${FLAT_FORM}/enterprises/:enterprise_id/policy/block_failed_login`,
  ENTERPRISE_POLICY_PASSWORD_PASSWORLESS: `${FLAT_FORM}/enterprises/:enterprise_id/policy/passwordless`,
  ENTERPRISE_POLICY_PASSWORD_2FA: `${FLAT_FORM}/enterprises/:enterprise_id/policy/2fa`,

  // Admin
  ADMIN_ENTERPRISES: `${ADMIN}/enterprises`,

  MAIL_CONFIGURATION: `${ADMIN}/mail_configuration`,
  MAIL_CONFIGURATION_TEST: `${ADMIN}/mail_configuration/test`,

  SSO_CONFIGURATION: `${ADMIN}/sso_configuration`,
  SSO_CONFIGURATION_GET_USER: `${API_URL}/v3/sso_configuration/get_user`,
  SSO_CONFIGURATION_CHECK_EXISTS: `${API_URL}/v3/sso_configuration/check_exists`,
}
