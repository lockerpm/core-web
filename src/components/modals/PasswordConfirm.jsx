import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import { } from 'react-redux';
import { orange } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { InfoCircleFilled } from "@ant-design/icons";

import global from "../../config/global";
import authServices from "../../services/auth";

const PasswordConfirmModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    title = '',
    okText = '',
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
        onConfirm(keyHash);
      } else {
        authServices.logout();
      }
      setCallingAPI(false);
    })
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleFilled style={{
            color: orange[5]
          }}/>
          <p className="ml-2">
            {title}
          </p>
        </div>
      }
      open={visible}
      width={360}
      okText={okText}
      onOk={() => handleConfirm()}
      onCancel={() => onClose()}
      okButtonProps={{
        loading: callingAPI,
        disabled: !password
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
    >
      <p className="mb-2">
        {t('password_confirm.confirm_note')}
      </p>
      <Form
        form={form}
        onFinish={handleConfirm}
      >
        <Form.Item
          name={'password'}
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

export default PasswordConfirmModal;