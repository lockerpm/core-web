import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  LogoutOutlined,
  LockOutlined,
  GroupOutlined
} from '@ant-design/icons';

import commonComponents from '../common';

import authServices from "../../services/auth";
import userServices from '../../services/user';
import commonServices from '../../services/common';

import global from '../../config/global';

function DropdownMenu() {
  const { UserAvatar } = commonComponents;
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const teams = useSelector((state) => state.enterprise.teams);

  const isEntepriseAdmin = useMemo(() => {
    return teams[0]?.role?.includes('admin')
  }, [teams])

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
            icon: <UserAvatar />,
            label: <></>,
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
          icon={<UserAvatar showInfo={false}/>}
        />
      </Space>
    </Dropdown>
  );
}

export default DropdownMenu;
