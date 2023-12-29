import React, { } from "react";
import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import { } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import global from "../../../../../../config/global";

const NewPassKeyModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    callingAPI = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  const [form] = Form.useForm();

  const handleConfirm = async () => {
    form.validateFields().then(async (values) => {
      onConfirm(values.passkeyName)
    })
  }
  return (
    <Modal
      title={t('security.passkey.add_new_key')}
      open={visible}
      onCancel={onClose}
      width={360}
      okButtonProps={{
        loading: callingAPI,
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
      onOk={() => handleConfirm()}
    >
      <div>
        <div className="mb-2">
          {t('security.passkey.add_new_key_description')}
        </div>
        <Form
          form={form}
          disabled={callingAPI}
          onFinish={handleConfirm}
        >
          <Form.Item
            name={'passkeyName'}
            rules={[
              global.rules.REQUIRED(t('common.name')),
            ]}
          >
            <Input
              autoFocus={true}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default NewPassKeyModal;