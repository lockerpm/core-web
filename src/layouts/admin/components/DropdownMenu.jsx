import React, { useMemo } from 'react';
import {
  Space,
  Button,
  Dropdown,
  Avatar,
  Tag
} from '@lockerpm/design';

import '../css/components/SidebarTop.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import authServices from "../../../services/auth";
import userServices from '../../../services/user';
import commonServices from '../../../services/common';

import global from '../../../config/global';
import common from '../../../utils/common';

import {
  LogoutOutlined,
  LockOutlined,
  GroupOutlined
} from '@ant-design/icons'

function DropdownMenu() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const locale = useSelector((state) => state.system.locale);
  const teams = useSelector((state) => state.enterprise.teams);

  const isEntepriseAdmin = useMemo(() => {
    return teams[0]?.role?.includes('admin')
  }, [teams])

  const roleDisplay = useMemo(() => {
    if (userInfo?.is_super_admin) {
      return <span>{t('roles.supper_admin')}</span>
    }
    if (teams.length === 0) {
      return <span>{userInfo?.email}</span>
    }
    const role = common.getUserRole(teams[0]?.role)
    return <span>{teams[0]?.name} - {t(role?.label)}</span>
  }, [teams, userInfo, locale])

  const AvatarIcon = useMemo((size = 32) => {
    if (userInfo?.avatar) {
      return <Avatar
        size={size}
        src={userInfo.avatar}
      >
        {userInfo.email.slice(0, 1)?.toUpperCase()}
      </Avatar>
    }
    return <Avatar
      size={size}
      style={{
        backgroundColor: 'var(--sidebar-menu-group-color)',
        color: 'var(--sidebar-menu-active-background-color)'
      }}
    >
      {userInfo?.name?.slice(0, 1)?.toUpperCase() || 'S'}
    </Avatar>
  }, [userInfo])

  const dropdownClick = async (item) => {
    if (item.key === 'account') {
      global.navigate(global.keys.SETTINGS_ACCOUNT)
    } else if (item.key === 'logout') {
      authServices.logout();
    } else if (item.key === 'lock') {
      await authServices.redirect_login();
    } else if (item.key === 'enterprise') {
      if (userInfo.is_super_admin) {
        global.navigate(global.keys.ENTERPRISES)
      } else {
        global.navigate(global.keys.ENTERPRISE_DASHBOARD, { enterprise_id: teams[0]?.id })
      }
    } else if (item.key === global.constants.LANGUAGE.EN || item.key === global.constants.LANGUAGE.VI) {
      handleUpdateAccount(item.key)
    }
  }

  const handleUpdateAccount = async (language) => {
    await userServices.update_users_me({
      email: userInfo.email,
      language: language,
    }).then(() => {
      commonServices.fetch_user_info();
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'account',
            icon: AvatarIcon,
            label: <div className='account-info'>
              <div className='font-semibold'>{userInfo?.name}</div>
              <p className='text-gray'>{roleDisplay}</p>
            </div>,
          },
          {
            key: 'language',
            label: <span>
              <span className='font-semibold'>
                {t('common.language')}:</span> <span>
                {t(global.constants.LANGUAGES.find((l) => l.value == userInfo?.language).label)}
              </span>
            </span>,
            children: global.constants.LANGUAGES.map((l) => ({
              key: l.value,
              label: t(l.label),
            }))
          },
          {
            key: 'enterprise',
            icon: <GroupOutlined />,
            label: <span>{t('sidebar.enterprise')}</span>,
            hide: !(userInfo.is_super_admin || isEntepriseAdmin)
          },
          {
            type: 'divider',
          },
          {
            key: 'lock',
            icon: <LockOutlined />,
            label: <span>{t('sidebar.lock_your_account')}</span>
          },
          {
            key: 'logout',
            danger: true,
            icon: <LogoutOutlined />,
            label: <span>{t('sidebar.logout')}</span>
          },
        ].filter((i) => !i.hide).map((i) => { delete i.hide; return i }),
        defaultSelectedKeys: [],
        onClick: dropdownClick
      }}
      placement="bottomLeft"
      trigger={'click'}
    >
      <Space wrap>
        <Button
          type='text'
          className='avatar-button'
          shape='circle'
          icon={AvatarIcon}
        />
      </Space>
    </Dropdown>
  );
}

export default DropdownMenu;
