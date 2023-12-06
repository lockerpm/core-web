import React, { useEffect, useMemo, useState } from 'react';
import {
  Space,
  Button,
  Dropdown,
  Avatar,
} from '@lockerpm/design';

import '../css/components/SidebarTop.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import authServices from "../../../services/auth";
import global from '../../../config/global';

import {
  LogoutOutlined,
  LockOutlined,
  GroupOutlined
} from '@ant-design/icons'

function DropdownMenu() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isCloud = useSelector((state) => state.system.isCloud);
  const locale = useSelector((state) => state.system.locale);

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
      if (isCloud) {
        window.open(process.env.REACT_APP_LOCKER_ID_URL)
      } else {
        global.navigate(global.keys.SETTINGS_ACCOUNT)
      }
    } else if (item.key === 'logout') {
      authServices.logout();
    } else if (item.key === 'lock') {
      await authServices.redirect_login();
    } else if (item.key === 'enterprise') {
      global.navigate(global.keys.ENTERPRISES)
    }
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'account',
            icon: AvatarIcon,
            label: <div className='account-info'>
              <div>{userInfo?.name}</div>
            </div>,
          },
          {
            key: 'language',
            label: <span>
              <span className='font-semibold'>
                {t('common.language')}:</span> <span>
                {t(global.constants.LANGUAGES.find((l, index) => l.value === locale || index === 0).label)}
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
            hide: false
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
