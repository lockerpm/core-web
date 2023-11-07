import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';

import { useTranslation } from "react-i18next";

import global from "../../../../../../config/global";
import authServices from "../../../../../../services/auth";
import common from "../../../../../../utils/common";

import { orange } from '@ant-design/colors';
import userServices from "../../../../../../services/user";

const DeauthorizeSessionsModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    device = null,
    onConfirm = () => {},
    onClose = () => {},
  } = props;
  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  const password = Form.useWatch('password', form);

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const handleConfirm = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true)
      const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
      const storedKeyHash = await global.jsCore.cryptoService.getKeyHash()
      if (!!storedKeyHash && !!keyHash && storedKeyHash == keyHash) {
        if (device) {
          await deauthorizeDevice();
          if (device.device_identifier === authServices.device_id()) {
            await authServices.redirect_login();
          } else {
            onConfirm();
            onClose();
          }
        } else {
          await deauthorizeSessions(keyHash);
          await authServices.redirect_login();
        }
      } else {
        authServices.logout();
      }
      setCallingAPI(false);
    })
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
    <Modal
      title={device
        ? t('security.manage_sessions.log_out_of', { device_name: common.getClientInfo(device).name })
        : t('security.manage_sessions.log_out_all')
      }
      open={visible}
      width={500}
      okText={t('common.confirm')}
      onOk={() => handleConfirm()}
      onCancel={() => onClose()}
      okButtonProps={{
        loading: callingAPI,
        disabled: !password,
        danger: true
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
    >
      {
        device ? <p className="mb-2">
          {t('security.manage_sessions.log_out_of_description')}
        </p> : <div className="mb-2">
          <p className="mb-2">
            {t('security.manage_sessions.log_out_all_description')}
          </p>
          <p style={{ color: orange[5] }}>
            {t('security.manage_sessions.log_out_all_note')}
          </p>
        </div>
      }
      <Form
        form={form}
        layout="vertical"
        onFinish={handleConfirm}
      >
        <Form.Item
          name={'password'}
          label={t('auth_pages.password')}
          rules={[
            global.rules.REQUIRED(t('auth_pages.password')),
          ]}
        >
          <Input.Password
            autoFocus={true}
            placeholder={t('placeholder.enter')}
            disabled={callingAPI}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DeauthorizeSessionsModal;