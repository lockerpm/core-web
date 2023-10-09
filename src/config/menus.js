import {
  LockOutlined,
  MobileOutlined,
  SecurityScanOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined,
  MailOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
  ImportOutlined,
  BellOutlined
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
      key: 'INVENTORY',
      icon: <LockOutlined />,
      label: <Trans i18nKey='sidebar.inventory' />,
      children: [
        {
          key: 'VAULT',
          label: <Trans i18nKey='sidebar.all' />
        },
        {
          key: 'PASSWORDS',
          label: <Trans i18nKey='sidebar.password' />
        },
        {
          key: 'NOTES',
          label: <Trans i18nKey='sidebar.notes' />
        },
        {
          key: 'CARDS',
          label: <Trans i18nKey='sidebar.cards' />
        },
        {
          key: 'CRYPTO_BACKUPS',
          label: <Trans i18nKey='sidebar.crypto_backups' />
        },
        {
          key: 'IDENTITIES',
          label: <Trans i18nKey='sidebar.identities' />
        },
      ]
    },
    {
      key: 'AUTHENTICATOR',
      icon: <MobileOutlined />,
      label: <Trans i18nKey='sidebar.authenticator' />,
    },
    {
      key: 'SECURITY_TOOLS',
      icon: <SecurityScanOutlined />,
      label: <Trans i18nKey='sidebar.security_tools' />,
    },
    {
      key: 'SHARES',
      icon: <ShareAltOutlined />,
      label: <Trans i18nKey='sidebar.shares' />,
    },
    {
      key: 'PRIVATE_EMAIL',
      icon: <MailOutlined />,
      label: <Trans i18nKey='sidebar.private_email' />,
    },
    {
      key: 'TRASH',
      icon: <DeleteOutlined />,
      label: <Trans i18nKey='sidebar.trash' />,
    },
    {
      key: 'SETTINGS',
      icon: <SettingOutlined />,
      router: 'SETTINGS_ACCOUNT',
      label: <Trans i18nKey='sidebar.settings' />,
    },
    {
      key: 'SETTINGS_ACCOUNT',
      parent: 'SETTINGS',
      icon: <UserOutlined />,
      label: <Trans i18nKey='sidebar.account' />,
    },
    {
      key: 'SETTINGS_IMPORT_EXPORT',
      parent: 'SETTINGS',
      icon: <ImportOutlined />,
      label: <Trans i18nKey='sidebar.import_export' />,
    },
    {
      key: 'SETTINGS_SECURITY',
      parent: 'SETTINGS',
      icon: <SecurityScanOutlined />,
      label: <Trans i18nKey='sidebar.security' />,
    },
    {
      key: 'SETTINGS_NOTIFICATION',
      parent: 'SETTINGS',
      icon: <BellOutlined />,
      label: <Trans i18nKey='sidebar.notifications' />,
    },
  ]
} 
