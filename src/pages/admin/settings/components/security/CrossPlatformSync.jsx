import React, { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  RedoOutlined,
} from "@ant-design/icons";

import modalsComponents from "../../../../../components/modals";

import userServices from "../../../../../services/user";
import commonServices from "../../../../../services/common";
import authServices from "../../../../../services/auth";

import global from "../../../../../config/global";

const { PasswordConfirmModal } = modalsComponents;

const CrossPlatformSync = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();

  const userInfo = useSelector(state => state.auth.userInfo);
  const isMobile = useSelector(state => state.system.isMobile);

  const [callingAPI, setCallingAPI] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const action = useMemo(() => {
    return userInfo.sync_all_platforms ? t('security.cross_platform_sync.turn_off') : t('security.cross_platform_sync.turn_on')
  }, [userInfo])

  const onConfirm = async (password) => {
    setCallingAPI(true);
    await toggleSyncPlatforms();
    if (!userInfo.sync_all_platforms) {
      await commonServices.service_login({
        email: userInfo.email,
        password: password,
        unlock_method: authServices.unlock_method()
      })
    }
    setCallingAPI(false);
    setConfirmVisible(false);
  }

  const toggleSyncPlatforms = async () => {
    await userServices.update_users_me({
      email: userInfo.email,
      sync_all_platforms: !userInfo.sync_all_platforms
    }).then(async () => {
      await commonServices.fetch_user_info();
      global.pushSuccess(t('notification.success.account_details.updated'));
    }).catch((error) => {
      global.pushError(error)
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
          onClick={() => setConfirmVisible(true)}
        >
          {isMobile ? '' : action}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.cross_platform_sync.description')}
      </p>
      <PasswordConfirmModal
        title={action}
        callingAPI={callingAPI}
        visible={confirmVisible}
        requireDesktop={!userInfo.sync_all_platforms}
        onClose={() => setConfirmVisible(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}

export default CrossPlatformSync;
