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
  FolderOutlined
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
      key: keys.TRASH,
      icon: <DeleteOutlined />,
      label: 'sidebar.trash',
    },
    {
      key: keys.SECURITY_TOOLS,
      icon: <SecurityScanOutlined />,
      label: 'sidebar.security_tools',
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
  ]
} 
