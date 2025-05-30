import React from 'react'
import {
  LockOutlined,
  MobileOutlined,
  SecurityScanOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
  ImportOutlined,
  BellOutlined,
  FolderOutlined,
  DashboardOutlined,
  ProjectOutlined,
  MailOutlined,
  KeyOutlined,
  GroupOutlined,
  MessageOutlined,
  BookOutlined
} from '@ant-design/icons'

import keys from './keys'

export default {
  ADMIN_MENUS: [
    {
      key: keys.ADMIN_ERROR,
      parent: keys.ERROR,
      icon: <ExclamationCircleOutlined />,
      label: 'common.error',
    },
    {
      key: keys.INVENTORY,
      router: keys.VAULT,
      icon: <LockOutlined />,
      label: 'sidebar.inventory',
    },
    {
      key: keys.VAULT,
      label: 'sidebar.all',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.PASSWORDS,
      label: 'sidebar.passwords',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.NOTES,
      label: 'sidebar.notes',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.CARDS,
      label: 'sidebar.cards',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.CRYPTO_BACKUPS,
      label: 'sidebar.crypto_backups',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.IDENTITIES,
      label: 'sidebar.identities',
      parent: keys.INVENTORY,
      isChildren: true
    },
    {
      key: keys.FOLDERS,
      icon: <FolderOutlined />,
      label: 'sidebar.folders',
    },
    {
      key: keys.AUTHENTICATOR,
      icon: <MobileOutlined />,
      label: 'sidebar.authenticator',
    },

    {
      key: keys.SHARES,
      router: keys.SHARED_WITH_ME,
      icon: <ShareAltOutlined />,
      label: 'sidebar.shares',
    },
    {
      key: keys.SHARED_WITH_ME,
      label: 'sidebar.shared_with_me',
      parent: keys.SHARES,
      isChildren: true
    },
    {
      key: keys.MY_SHARED_ITEMS,
      label: 'sidebar.my_shared_items',
      parent: keys.SHARES,
      isChildren: true
    },
    {
      key: keys.SECURITY_TOOLS,
      icon: <SecurityScanOutlined />,
      label: 'sidebar.security_tools',
    },
    {
      key: keys.POLICIES,
      icon: <BookOutlined />,
      label: 'policies.title',
    },
    {
      key: keys.SETTINGS,
      icon: <SettingOutlined />,
      router: keys.SETTINGS_ACCOUNT,
      label: 'sidebar.settings',
    },
    {
      key: keys.SETTINGS_ACCOUNT,
      parent: keys.SETTINGS,
      icon: <UserOutlined />,
      label: 'sidebar.account',
    },
    {
      key: keys.SETTINGS_IMPORT_EXPORT,
      parent: keys.SETTINGS,
      icon: <ImportOutlined />,
      label: 'sidebar.import_export',
    },
    {
      key: keys.SETTINGS_SECURITY,
      parent: keys.SETTINGS,
      icon: <SecurityScanOutlined />,
      label: 'sidebar.security',
    },
    {
      key: keys.SETTINGS_NOTIFICATIONS,
      parent: keys.SETTINGS,
      icon: <BellOutlined />,
      label: 'sidebar.notifications',
    },
    {
      key: keys.TRASH,
      icon: <DeleteOutlined />,
      label: 'sidebar.trash',
    },

    // Enterprise
    {
      key: keys.ENTERPRISES,
      parent: keys.ENTERPRISES,
      icon: <ProjectOutlined />,
      label: 'sidebar.enterprises',
    },
    {
      key: keys.EMAIL_SETTINGS,
      parent: keys.ENTERPRISES,
      icon: <MailOutlined />,
      label: 'sidebar.email_settings',
    },
    {
      key: keys.SSO_CONFIGURATION,
      parent: keys.ENTERPRISES,
      icon: <KeyOutlined />,
      label: 'sidebar.sso_configuration',
    },

    // Enterprise detail
    {
      key: keys.ENTERPRISE_DASHBOARD,
      parent: keys.ENTERPRISE,
      icon: <DashboardOutlined />,
      label: 'sidebar.enterprise_dashboard',
    },
    {
      key: keys.ENTERPRISE_MEMBERS,
      parent: keys.ENTERPRISE,
      icon: <UserOutlined />,
      label: 'sidebar.enterprise_members',
    },
    {
      key: keys.ENTERPRISE_GROUPS,
      parent: keys.ENTERPRISE,
      icon: <GroupOutlined />,
      label: 'sidebar.enterprise_groups',
    },
    {
      key: keys.ENTERPRISE_POLICIES,
      parent: keys.ENTERPRISE,
      icon: <ProjectOutlined />,
      label: 'sidebar.enterprise_policies',
    },
    {
      key: keys.ENTERPRISE_ACTIVITY_LOGS,
      parent: keys.ENTERPRISE,
      icon: <MessageOutlined />,
      label: 'sidebar.enterprise_activity_logs',
    },
  ]
} 
