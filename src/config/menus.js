import {
  UserOutlined,
  BellOutlined,
  ControlOutlined,
  ExclamationCircleOutlined,
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
  ]
} 
