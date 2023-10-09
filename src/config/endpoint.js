const BACKEND_URL = process.env.REACT_APP_API_URL

export default {
  AUTH: `${BACKEND_URL}/v1/sso/auth`,
  AUTH_OTP: `${BACKEND_URL}/v1/sso/auth/otp`,
  LOGOUT: `${BACKEND_URL}/v1/sso/logout`,

  USERS: `${BACKEND_URL}/v1/sso/users`,
  USERS_EXIST: `${BACKEND_URL}/v1/sso/users/exist`,
  USERS_ME: `${BACKEND_URL}/v1/sso/users/me`,
  USERS_ME_UPLOAD_AVATAR: `${BACKEND_URL}/v1/sso/users/me/upload_avatar`,
  USERS_ME_FACTOR2: `${BACKEND_URL}/v1/sso/users/me/factor2`,
  USERS_ME_FACTOR2_SMART_OTP: `${BACKEND_URL}/v1/sso/users/me/factor2/smart_otp`,
  USERS_REGISTER: `${BACKEND_URL}/v1/sso/users/register`,
  USERS_CHANGE_PASSWORD: `${BACKEND_URL}/v1/sso/users/change_password`,

  SYNC:  `${BACKEND_URL}/v1/sync`,
  SYNC_STATISTIC:  `${BACKEND_URL}/v1/sync/statistic`,
  SYNC_PROFILE_DATA:  `${BACKEND_URL}/v1/sync/profile_data`,
  SYNC_REVISION_DATE:  `${BACKEND_URL}/v1/sync/revision_date`,

  WORKSPACES: `${BACKEND_URL}/v1/organizations`,
  WORKSPACE: `${BACKEND_URL}/v1/organizations/:id`,
  WORKSPACE_MEMBERS: `${BACKEND_URL}/v1/organizations/:id/members`,
  WORKSPACE_MEMBER: `${BACKEND_URL}/v1/organizations/:id/members/:member_id`,
  WORKSPACE_MEMBER_REINVITE: `${BACKEND_URL}/v1/organizations/:id/members/:member_id/reinvite`,
  WORKSPACE_CREATE_MEMBERS: `${BACKEND_URL}/v1/organizations/:id/members/create_members`,
  WORKSPACE_CREATE_PROJECTS: `${BACKEND_URL}/v1/organizations/:id/create_projects`,
  WORKSPACE_IMPORT: `${BACKEND_URL}/v1/organizations/:id/import`,
  WORKSPACE_ACCESS_LOGS: `${BACKEND_URL}/v1/organizations/:id/access_logs`,

  WORKSPACE_MAIL_CONFIGURATION: `${BACKEND_URL}/v1/organizations/:id/mail_configuration`,
  WORKSPACE_MAIL_CONFIGURATION_TEST: `${BACKEND_URL}/v1/organizations/:id/mail_configuration/test`,

  PROJECTS: `${BACKEND_URL}/v1/projects`,
  PROJECT: `${BACKEND_URL}/v1/projects/:id`,
  PROJECTS_DELETE: `${BACKEND_URL}/v1/projects/delete_projects`,

  PROJECT_SECRETS: `${BACKEND_URL}/v1/projects/:id/secrets`,
  PROJECT_SECRETS_CREATE_MULTIPLE: `${BACKEND_URL}/v1/projects/:id/secrets/create_secrets`,
  PROJECT_SECRET: `${BACKEND_URL}/v1/projects/:id/secrets/:secret_id`,

  PROJECT_ENVIRONMENTS: `${BACKEND_URL}/v1/projects/:id/environments`,
  PROJECT_ENVIRONMENTS_CREATE_MULTIPLE: `${BACKEND_URL}/v1/projects/:id/environments/create_environments`,
  PROJECT_ENVIRONMENT: `${BACKEND_URL}/v1/projects/:id/environments/:environment_id`,

  PROJECT_ACCESS_LOGS: `${BACKEND_URL}/v1/projects/:id/access_logs`,

  PROJECT_ACCESS_KEYS: `${BACKEND_URL}/v1/projects/:id/access_keys`,
  PROJECT_ACCESS_KEY: `${BACKEND_URL}/v1/projects/:id/access_keys/:access_key_id`,
  PROJECT_ACCESS_KEY_ACTIVATED: `${BACKEND_URL}/v1/projects/:id/access_keys/:access_key_id/activated`,
  PROJECT_ACCESS_KEY_ROTATE_KEY: `${BACKEND_URL}/v1/projects/:id/access_keys/:access_key_id/rotate_key`,

  PROJECT_MEMBERS: `${BACKEND_URL}/v1/projects/:id/members`,
  PROJECT_MEMBER: `${BACKEND_URL}/v1/projects/:id/members/:member_id`,
  PROJECT_CREATE_MEMBERS: `${BACKEND_URL}/v1/projects/:id/members/create_members`,

  EVENTS: `${BACKEND_URL}/v1/events`,

  RESOURCE_COUNTRIES: `${BACKEND_URL}/v1/resources/countries`,
  RESOURCE_MAIL_PROVIDERS: `${BACKEND_URL}/v1/resources/mail_providers`,
  RESOURCE_ACCESS_LOG_CLIENTS: `${BACKEND_URL}/v1/resources/access_log_clients`,
}