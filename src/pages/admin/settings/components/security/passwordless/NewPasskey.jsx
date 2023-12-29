import React, { useState } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PairingForm, PasswordlessForm } from "../../../../../../components";

const NewPassKeyModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    callingAPI = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  return (
    <Modal
      title={t('security.passkey.add_new_key')}
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      <div>
        <div className="mb-2">
          {t('security.passkey.add_new_key_description')}
        </div>
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
              disabled={checking || callingAPI}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default NewPassKeyModal;