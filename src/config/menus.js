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
  BellOutlined,
  FolderOutlined
} from '@ant-design/icons'

import { Trans } from 'react-i18next'

import keys from './keys'

export default {
  ADMIN_MENUS: [
    {
      key: keys.ADMIN_ERROR,
      parent: keys.ERROR,
      icon: <ExclamationCircleOutlined />,
      label: <Trans i18nKey='common.error' />,
    },
    {
      key: keys.INVENTORY,
      icon: <LockOutlined />,
      label: <Trans i18nKey='sidebar.inventory' />,
      children: [
        {
          key: keys.VAULT,
          label: <Trans i18nKey='sidebar.all' />
        },
        {
          key: keys.PASSWORDS,
          label: <Trans i18nKey='sidebar.passwords' />
        },
        {
          key: keys.NOTES,
          label: <Trans i18nKey='sidebar.notes' />
        },
        {
          key: keys.CARDS,
          label: <Trans i18nKey='sidebar.cards' />
        },
        {
          key: keys.CRYPTO_BACKUPS,
          label: <Trans i18nKey='sidebar.crypto_backups' />
        },
        {
          key: keys.IDENTITIES,
          label: <Trans i18nKey='sidebar.identities' />
        },
      ]
    },
    {
      key: keys.FOLDERS,
      icon: <FolderOutlined />,
      label: <Trans i18nKey='sidebar.folders' />,
    },
    {
      key: keys.AUTHENTICATOR,
      icon: <MobileOutlined />,
      label: <Trans i18nKey='sidebar.authenticator' />,
    },
    {
      key: keys.SECURITY_TOOLS,
      icon: <SecurityScanOutlined />,
      label: <Trans i18nKey='sidebar.security_tools' />,
    },
    {
      key: keys.SHARES,
      icon: <ShareAltOutlined />,
      label: <Trans i18nKey='sidebar.shares' />,
    },
    {
      key: keys.PRIVATE_EMAIL,
      icon: <MailOutlined />,
      label: <Trans i18nKey='sidebar.private_email' />,
    },
    {
      key: keys.TRASH,
      icon: <DeleteOutlined />,
      label: <Trans i18nKey='sidebar.trash' />,
    },
    {
      key: keys.SETTINGS,
      icon: <SettingOutlined />,
      router: keys.SETTINGS_ACCOUNT,
      label: <Trans i18nKey='sidebar.settings' />,
    },
    {
      key: keys.SETTINGS_ACCOUNT,
      parent: keys.SETTINGS,
      icon: <UserOutlined />,
      label: <Trans i18nKey='sidebar.account' />,
    },
    {
      key: keys.SETTINGS_IMPORT_EXPORT,
      parent: keys.SETTINGS,
      icon: <ImportOutlined />,
      label: <Trans i18nKey='sidebar.import_export' />,
    },
    {
      key: keys.SETTINGS_SECURITY,
      parent: keys.SETTINGS,
      icon: <SecurityScanOutlined />,
      label: <Trans i18nKey='sidebar.security' />,
    },
    {
      key: keys.SETTINGS_NOTIFICATIONS,
      parent: keys.SETTINGS,
      icon: <BellOutlined />,
      label: <Trans i18nKey='sidebar.notifications' />,
    },
  ]
} 
