import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Avatar,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';


import common from '../../utils/common';

function UserAvatar(props) {
  const {
    size = 32,
    showInfo = true
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const locale = useSelector((state) => state.system.locale);
  const teams = useSelector((state) => state.enterprise.teams);

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

  return (
    <div className='flex items-center'>
      {
        userInfo?.avatar && <Avatar
          size={size}
          src={userInfo.avatar}
        >
          {userInfo?.email?.slice(0, 1)?.toUpperCase()}
        </Avatar>
      }
      {
        !userInfo?.avatar && <Avatar
          size={size}
          style={{
            backgroundColor: 'var(--sidebar-menu-group-color)',
            color: 'var(--sidebar-menu-active-background-color)'
          }}
        >
          {userInfo?.name?.slice(0, 1)?.toUpperCase() || 'S'}
        </Avatar>
      }
      {
        showInfo && <div className='account-info ml-2'>
          <div className='font-semibold'>{userInfo?.name}</div>
          <p className='text-black-500'>{roleDisplay}</p>
        </div>
      }
    </div>
  );
}

export default UserAvatar;
