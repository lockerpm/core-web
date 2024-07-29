import React, { useState, useEffect } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import {
  InfoCircleFilled
} from "@ant-design/icons";

import mailConfigServices from "../../../../services/mail-config";

import global from "../../../../config/global";

const SendEmail = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    onClose = () => { },
  } = props;
  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  const testEmail = Form.useWatch('testEmail', form);

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const handleSendMail = async () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      await mailConfigServices.send_test({ email: testEmail }).then(async () => {
        global.pushSuccess(t('notification.success.email_settings.send_test'))
        onClose();
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleFilled className="text-primary"/>
          <p className="ml-2">
            {t('email_settings.send_test.title')}
          </p>
        </div>
      }
      open={visible}
      width={360}
      okText={t('button.send')}
      onOk={() => handleSendMail()}
      onCancel={() => onClose()}
      okButtonProps={{
        loading: callingAPI,
        disabled: !testEmail
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
    >
      <p className="mb-2">
        {t('email_settings.send_test.description')}
      </p>
      <Form
        form={form}
        onFinish={handleSendMail}
      >
        <Form.Item
          name={'testEmail'}
          rules={[
            global.rules.REQUIRED(t('common.email')),
            global.rules.INVALID(t('common.email'), 'EMAIL'),
          ]}
        >
          <Input
            placeholder={'example@gmail.com'}
            disabled={callingAPI}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SendEmail;