import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import modalsComponents from "../../../../../../components/modals";

import authServices from "../../../../../../services/auth";
import userServices from "../../../../../../services/user";

import global from "../../../../../../config/global";
import common from "../../../../../../utils/common";

const DeauthorizeSessionsModal = (props) => {
  const { PasswordConfirmModal } = modalsComponents;
  const { t } = useTranslation()
  const {
    visible = false,
    device = null,
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const [callingAPI, setCallingAPI] = useState(false);

  const handleConfirm = async (password) => {
    setCallingAPI(true)
    if (device) {
      await deauthorizeDevice();
      if (device.device_identifier === common.deviceId()) {
        await authServices.logout();
      } else {
        onConfirm();
        onClose();
      }
    } else {
      const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
      await deauthorizeSessions(keyHash);
      await authServices.logout();
    }
    setCallingAPI(false);
  }

  const deauthorizeDevice = async () => {
    await userServices.remove_device(device.device_identifier).then(() => {
      global.pushSuccess(t('notification.success.manage_sessions.logout_device'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const deauthorizeSessions = async (hashedPassword) => {
    await userServices.revoke_all_devices(hashedPassword).then(() => {
      global.pushSuccess(t('notification.success.manage_sessions.logout_all_devices'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <PasswordConfirmModal
      visible={visible}
      danger={true}
      width={500}
      title={device
        ? t('security.manage_sessions.log_out_of', { device_name: common.getClientInfo(device).name })
        : t('security.manage_sessions.log_out_all')
      }
      description={
        device ? <p className="mb-2">
          {t('security.manage_sessions.log_out_of_description')}
        </p> : <div className="mb-2">
          <p className="mb-2">
            {t('security.manage_sessions.log_out_all_description')}
          </p>
          <p className="text-warning">
            {t('security.manage_sessions.log_out_all_note')}
          </p>
        </div>
      }
      callingAPI={callingAPI}
      okText={t('button.confirm')}
      onConfirm={handleConfirm}
      onClose={() => onClose()}
    />
  );
}

export default DeauthorizeSessionsModal;