import React, { useState, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../../config/global';
import emergencyAccessServices from '../../../../../../services/emergency-access';

import { GeneratePassword } from '../../../../../../components';

function ResetPasswordFormData(props) {
  const {
    item = null,
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  const newPassword = Form.useWatch('new_password', form) || ''

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleConfirm = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      await emergencyAccessServices.id_password(item.id, { new_password: values.new_password })
        .then(() => {
          global.pushSuccess(t('notification.success.emergency_access.takeover_password', { user: item.email }))
          onClose();
        }).catch((error) => {
          global.pushError(error)
        })
        setCallingAPI(false);
      }
    )
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('security.emergency_access.takeover.title')}
        placement="right"
        onClose={onClose}
        open={visible}
        width={500}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleConfirm}
            >
            { t('button.confirm') } 
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <Form.Item
            name={'new_password'}
            className='mb-2'
            label={t('security.emergency_access.takeover.new_id_password')}
            rules={[
              global.rules.REQUIRED(t('security.emergency_access.takeover.new_id_password')),
              global.rules.LATEST_LENGTH(t('security.emergency_access.takeover.new_id_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <GeneratePassword
            password={newPassword}
            onFill={(v) => form.setFieldValue('new_password', v)}
          />
          <Form.Item
            name={'confirm_new_password'}
            label={t('security.emergency_access.takeover.re_new_id_password')}
            rules={[
              global.rules.REQUIRED(t('security.emergency_access.takeover.re_new_id_password')),
              global.rules.LATEST_LENGTH(t('security.emergency_access.takeover.re_new_id_password'), 8),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('new_password') !== value) {
                    return Promise.reject(new Error(t('validation.passwords_not_match')));
                  }
                },
              }),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ResetPasswordFormData;
