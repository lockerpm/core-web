import React, { useMemo } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import userServices from "../../../../../services/user";
import commonServices from "../../../../../services/common";

import {
  RedoOutlined,
} from "@ant-design/icons";

import global from "../../../../../config/global";

const CrossPlatformSync = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  
  const userInfo = useSelector(state => state.auth.userInfo);

  const action = useMemo(() => {
    return userInfo.sync_all_platforms ? t('security.cross_platform_sync.turn_off') : t('security.cross_platform_sync.turn_on')
  }, [userInfo])

  const handleToggleSyncPlatforms = async () => {
    global.confirm(async () => {
      await userServices.update_users_me({
        email: userInfo.email,
        sync_all_platforms: !userInfo.sync_all_platforms
      }).then(() => {
        commonServices.fetch_user_info();
        global.pushSuccess(t('notification.success.account_details.updated'));
      }).catch((error) => {
        global.pushError(error)
      })
    }, {
      content: t('security.cross_platform_sync.question', { action: action }),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    })
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.cross_platform_sync.title')}
        </p>
        <Button
          type='primary'
          ghost
          icon={<RedoOutlined />}
          onClick={() => handleToggleSyncPlatforms()}
        >
          {action}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.cross_platform_sync.description')}
      </p>
    </div>
  );
}

export default CrossPlatformSync;
