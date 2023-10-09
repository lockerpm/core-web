import { Trans } from 'react-i18next'

const ACCESS_TYPE_VALUE = {
  READ: 'access_key_read',
  WRITE: 'access_key_write'
}

const WS_MEMBER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member'
}
const WS_MEMBER_STATUS = {
  CREATED: 'created',
  ACCESSED: 'accessed'
}
const PROJECT_MEMBER_ROLE = {
  READ_ONLY: 'project_read_only',
  REGULAR: 'project_regular',
  ADMIN: 'project_admin'
}
const PROJECT_MEMBER_STATUS = {
  CONFIRMED: 'confirmed',
  INVITED: 'invited',
  ACCEPTED: 'accepted'
}
const FILE_TYPE = {
  JSON: 'json',
}

export default {
  SERVICE_SCOPE: 'portal_internal',
  PAGE_SIZE: 50,
  ACCESS_TYPE_VALUE,
  WS_MEMBER_ROLE,
  WS_MEMBER_STATUS,
  PROJECT_MEMBER_ROLE,
  PROJECT_MEMBER_STATUS,
  FILE_TYPE,
  LANGUAGES: [
    {
      value: 'en',
      label: <Trans i18nKey='common.english' />,
    },
    {
      value: 'vi',
      label: <Trans i18nKey='common.vietnamese' />,
    },
  ],
  ACCESS_TYPES: [
    {
      value: ACCESS_TYPE_VALUE.READ,
      color: 'default',
      label: <Trans i18nKey='access_log.access_key_read' />,
    },
    {
      value: ACCESS_TYPE_VALUE.WRITE,
      color: 'success',
      label: <Trans i18nKey='access_log.access_key_write' />,
    },
  ],
  ACCESS_KEY_PERMISSIONS: [
    {
      value: false,
      color: 'default',
      label: <Trans i18nKey='common.read' />,
    },
    {
      value: true,
      color: 'success',
      label: <Trans i18nKey='common.write' />,
    },
  ],
  ACCESS_KEY_STATUSES: [
    {
      value: false,
      color: 'default',
      label: <Trans i18nKey='common.inactive' />,
    },
    {
      value: true,
      color: 'success',
      label: <Trans i18nKey='common.active' />,
    },
  ],
  WORKSPACE_MEMBER_ROLES: [
    {
      value: WS_MEMBER_ROLE.MEMBER,
      color: 'blue',
      label: <Trans i18nKey='roles.member' />,
    },
    {
      value: WS_MEMBER_ROLE.ADMIN,
      color: 'success',
      label: <Trans i18nKey='roles.admin' />,
    },
  ],
  WORKSPACE_MEMBER_STATUSES: [
    {
      value: WS_MEMBER_STATUS.CREATED,
      color: 'blue',
      label: <Trans i18nKey='statuses.created' />,
    },
    {
      value: WS_MEMBER_STATUS.ACCESSED,
      color: 'success',
      label: <Trans i18nKey='statuses.accessed' />,
    },
  ],
  PROJECT_MEMBER_ROLES: [
    {
      value: PROJECT_MEMBER_ROLE.READ_ONLY,
      color: 'info',
      label: <Trans i18nKey='roles.project_read_only' />,
    },
    {
      value: PROJECT_MEMBER_ROLE.REGULAR,
      color: 'blue',
      label: <Trans i18nKey='roles.project_regular' />,
    },
    {
      value: PROJECT_MEMBER_ROLE.ADMIN,
      color: 'success',
      label: <Trans i18nKey='roles.project_admin' />,
    },
  ],
  PROJECT_MEMBER_STATUSES: [
    {
      value: PROJECT_MEMBER_STATUS.CONFIRMED,
      color: 'info',
      label: <Trans i18nKey='statuses.confirmed' />,
    },
    {
      value: PROJECT_MEMBER_STATUS.INVITED,
      color: 'blue',
      label: <Trans i18nKey='statuses.invited' />,
    },
    {
      value: PROJECT_MEMBER_STATUS.ACCEPTED,
      color: 'success',
      label: <Trans i18nKey='statuses.accepted' />,
    }
  ],
  IMPORT_EXPORT_FILE_TYPES: [
    {
      value: FILE_TYPE.JSON,
      label: 'Json'
    }
  ],
  SMTP_PROVIDERS: [
    {
      name: 'Other SMTP provider',
      host: '',
      port: ''
    },
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: '587'
    },
    {
      name: 'Microsoft Outlook',
      host: 'smtp.office365.com',
      port: '587'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: '587'
    },
    {
      name: 'Mailtrap Email Sending',
      host: 'live.smtp.mailtrap.io',
      port: '587'
    },
    {
      name: 'Mailgun',
      host: 'mtp.mailgun.org',
      port: '587'
    },
    {
      name: 'Apple mail',
      host: 'smtp.mail.me.com',
      port: '587'
    },
    {
      name: 'Mandrill',
      host: 'smtp.mandrillapp.com',
      port: '587'
    },
    {
      name: 'SparkPost',
      host: 'mtp.sparkpostmail.com',
      port: '587'
    },
    {
      name: 'Postmark',
      host: 'smtp.postmarkapp.com',
      port: '587'
    },
  ]
}
