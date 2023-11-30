import React, { useMemo, useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components';

import ConfirmModal from "./cross-platform-sync/Confirm";

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
  const [password, setPassword] = useState(null)
  const [callingAPI, setCallingAPI] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const action = useMemo(() => {
    return userInfo.sync_all_platforms ? t('security.cross_platform_sync.turn_off') : t('security.cross_platform_sync.turn_on')
  }, [userInfo])

  const onConfirmPassword = async (keyHash, password) => {
    setPassword(password)
    if (service.pairingService?.hasKey) {
      await toggleSyncPlatforms();
      await serviceLogin(password, !userInfo.sync_all_platforms);
      setConfirmVisible(false);
    } else {
      setConfirmVisible(true);
    }
    setConfirmPasswordVisible(false);
  }

  const onConfirm = async (data) => {
    setCallingAPI(true);
    await toggleSyncPlatforms();
    await serviceLogin(data || password, !userInfo.sync_all_platforms);
    setConfirmVisible(true);
    setCallingAPI(false);
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

  const serviceLogin = async (password, sync_all_platforms) => {
    if (sync_all_platforms) {
      await commonServices.service_login({
        email: userInfo.email,
        password
      })
    }
  }

  const handleOpenConfirmModal = () => {
    if (userInfo.login_method === 'password') {
      setConfirmPasswordVisible(true)
    } else {
      setConfirmVisible(true)
    }
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
          onClick={() => handleOpenConfirmModal()}
        >
          {action}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.cross_platform_sync.description')}
      </p>
      <PasswordConfirmModal
        title={action}
        visible={confirmPasswordVisible}
        onClose={() => setConfirmPasswordVisible(false)}
        onConfirm={onConfirmPassword}
      />
      <ConfirmModal
        action={action}
        callingAPI={callingAPI}
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}

export default CrossPlatformSync;
