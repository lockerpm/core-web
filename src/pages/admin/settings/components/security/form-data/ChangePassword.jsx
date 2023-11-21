import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../../config/global';
import userServices from '../../../../../../services/user';
import authServices from '../../../../../../services/auth';

function ChangePasswordFormData(props) {
  const {
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo)

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      await userServices.change_password({
        username: userInfo.email,
        ...values,
      }).then(async () => {
        global.pushSuccess(t('notification.success.change_password.changed'));
        onClose();
        authServices.logout();
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }



  return (
    <div className={props.className}>
      <Drawer
        title={t('change_password.title')}
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
              onClick={handleSave}
            >
            { t('button.save') } 
            </Button>
          </Space>
        }
      >
        <p className='mb-2'>{t('change_password.subtitle')}</p>
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <Form.Item
            name={'password'}
            label={t('change_password.current_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.current_password")),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'new_password'}
            label={t('change_password.new_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.new_password")),
              global.rules.LATEST_LENGTH(t('change_password.new_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'confirm_new_password'}
            label={t('change_password.confirm_new_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.confirm_new_password")),
              global.rules.LATEST_LENGTH(t('change_password.confirm_new_password'), 8),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value.length >= 8 && getFieldValue('new_password') !== value) {
                    return Promise.reject(new Error(t('validation.passwords_not_match')));
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name="password_hint"
            label={t('auth_pages.password_hint')}
          >
            <Input.Password
              placeholder={t('placeholder.enter')}
              disabled={callingAPI}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ChangePasswordFormData;
