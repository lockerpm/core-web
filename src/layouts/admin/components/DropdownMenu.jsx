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
  PlusOutlined
} from '@ant-design/icons'

function DropdownMenu() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const isCloud = useSelector((state) => state.system.isCloud);
  const selectedWorkspace = useSelector((state) => state.workspace.selectedWorkspace);

  const AvatarIcon = useMemo((size = 32) => {
    if (userInfo?.avatar) {
      return <Avatar
        size={size}
        src={userInfo.avatar}
      />
    }
    return <Avatar
      size={size}
      style={{
        backgroundColor: 'var(--sidebar-menu-group-color)',
        color: 'var(--sidebar-menu-active-background-color)'
      }}
    >
      {userInfo?.full_name?.slice(0, 1)?.toUpperCase() || 'S'}
    </Avatar>
  }, [userInfo])

  const items = [
    {
      key: 'account',
      icon: AvatarIcon,
      label: <div className='account-info'>
        <div>{userInfo?.full_name}</div>
      </div>,
    },
    {
      key: 'workspace',
      label: <span>
        <span className='font-semibold'>
          {t('common.workspace')}:</span> <span>{selectedWorkspace?.name}
        </span>
      </span>,
      children: isCloud ? [
        ...workspaces.map((w) => ({
          key: `workspace_${w.id}`,
          label: <p className={w.id === selectedWorkspace?.id ? 'text-primary' : ''}>
            {w.name}
          </p>,
        })),
        {
          type: 'divider'
        },
        {
          key: 'create',
          label: <div
            className='flex items-center'
            onClick={() => global.navigate('CREATE_WORKSPACE')}
          >
            <PlusOutlined className='mr-2'/>
            {t('button.new_workspace')}
          </div>
        }
      ] : null
    },
    {
      key: 'language',
      label: <span>
        <span className='font-semibold'>{t('common.language')}:</span> <span>English (US)</span>
      </span>,
      children: global.constants.LANGUAGES.map((l) => ({
        key: l.value,
        label: l.label,
      }))
    },
    {
      type: 'divider',
    },
    {
      key: 'locker_help_center',
      label: <a href={':;'} target="_blank">
        {t('sidebar.locker_help_center')}
      </a>
    },
    {
      key: 'locker_community_forum',
      label: <a href={':;'} target="_blank">
        {t('sidebar.locker_community_forum')}
      </a>
    },
    {
      key: 'status_page',
      label: <a href={':;'} target="_blank">
        {t('sidebar.status_page')}
      </a>
    },
    {
      key: 'terms_policy',
      label: <a href={':;'} target="_blank">
        {t('sidebar.terms_policy')}
      </a>
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: <span>{t('sidebar.logout')}</span>
    },
  ]


  const dropdownClick = (item) => {
    if (item.key === 'account') {
      if (isCloud) {
        window.open(process.env.REACT_APP_LOCKER_ID_URL)
      } else {
        global.navigate('ACCOUNT_DETAILS')
      }
    } else if (item.key === 'logout') {
      authServices.logout();
    } else if (item.key.includes('workspace_')) {
      const workspace_id = item.key.split('workspace_')[1]
      global.navigate('PROJECTS', { workspace_id })
    }
  }

  return (
    <Dropdown
      menu={{
        items,
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
