import {
  CalendarOutlined,
  SafetyOutlined,
  GlobalOutlined,
  BuildOutlined,
  KeyOutlined,
  CreditCardOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  ControlOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  ImportOutlined
} from '@ant-design/icons'

import { Trans } from 'react-i18next'
import constants from './constants'

export default {
  ADMIN_MENUS: [
    {
      key: 'ADMIN_ERROR',
      parent: 'ERROR',
      icon: <ExclamationCircleOutlined />,
      label: <Trans i18nKey='common.error' />,
    },
    {
      key: 'ACCOUNT_DETAILS',
      parent: 'ACCOUNT',
      icon: <UserOutlined />,
      label: <Trans i18nKey='account_details.title' />,
    },
    {
      key: 'ACCOUNT_NOTIFICATIONS',
      parent: 'ACCOUNT',
      icon: <BellOutlined />,
      label: <Trans i18nKey='notifications.title' />,
    },
    {
      key: 'ACCOUNT_MANAGE_SESSIONS',
      parent: 'ACCOUNT',
      icon: <ControlOutlined />,
      label: <Trans i18nKey='manage_sessions.title' />,
    },
    {
      key: 'PROJECTS',
      icon: <ProjectOutlined />,
      label: <Trans i18nKey='projects.title' />,
    },
    {
      key: 'PROJECT_SECRETS',
      parent: 'PROJECTS',
      icon: <SafetyOutlined />,
      label: <Trans i18nKey='secrets.title' />,
    },
    {
      key: 'PROJECT_ENVIRONMENTS',
      parent: 'PROJECTS',
      icon: <GlobalOutlined />,
      label: <Trans i18nKey='environments.title' />,
    },
    {
      key: 'PROJECT_ACCESS_KEY',
      parent: 'PROJECTS',
      icon: <KeyOutlined />,
      label: <Trans i18nKey='access_key.title' />,
    },
    {
      key: 'PROJECT_ACCESS_LOG',
      parent: 'PROJECTS',
      icon: <BuildOutlined />,
      label: <Trans i18nKey='access_log.title' />,
    },
    {
      key: 'PROJECT_SETTINGS',
      parent: 'PROJECTS',
      icon: <SettingOutlined />,
      label: <Trans i18nKey='settings.title' />,
      pRoles: [
        constants.PROJECT_MEMBER_ROLE.ADMIN,
      ],
      children: [
        {
          key: 'PROJECT_INFO',
          label: <Trans i18nKey='project_info.title' />
        },
        {
          key: 'PROJECT_MEMBERS',
          label: <Trans i18nKey='project_members.title' />
        },
      ]
    },
    {
      key: 'EVENTS',
      icon: <CalendarOutlined />,
      label: <Trans i18nKey='events.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
    // {
    //   key: 'BILLING',
    //   icon: <CreditCardOutlined />,
    //   label: <Trans i18nKey='billing.title' />,
    //   wsRoles: [
    //     constants.WS_MEMBER_ROLE.ADMIN,
    //   ],
    // },
    {
      key: 'WORKSPACE_SETTINGS',
      router: 'WORKSPACE_INFORMATION',
      icon: <SettingOutlined />,
      label: <Trans i18nKey='settings.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
    {
      key: 'WORKSPACE_INFORMATION',
      parent: 'WORKSPACE_SETTINGS',
      icon: <InfoCircleOutlined />,
      label: <Trans i18nKey='information.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
    {
      key: 'WORKSPACE_MEMBERS',
      parent: 'WORKSPACE_SETTINGS',
      icon: <UsergroupAddOutlined />,
      label: <Trans i18nKey='members.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
    {
      key: 'WORKSPACE_IMPORT_EXPORT',
      parent: 'WORKSPACE_SETTINGS',
      icon: <ImportOutlined />,
      label: <Trans i18nKey='import_export.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
    {
      key: 'WORKSPACE_EMAIL_SETTING',
      parent: 'WORKSPACE_SETTINGS',
      icon: <MailOutlined />,
      label: <Trans i18nKey='email_setting.title' />,
      wsRoles: [
        constants.WS_MEMBER_ROLE.ADMIN,
      ],
    },
  ]
} 
