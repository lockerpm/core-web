import React, { useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Input,
  Button
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import global from '../../config/global';

function ChangePasswordForm(props) {
  const {
    className = '',
    isReset = true,
    changing = false,
    onSave = () => { }
  } = props
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, []);

  return (
    <div className={className}>
      {
        !isReset && <p className='font-semibold text-left mb-4'>
          {t('passwordless.new_password')}
        </p>
      }
      <Form
        form={form}
        layout="vertical"
        labelAlign={'left'}
        onFinish={onSave}
      >
        <Form.Item
          name={'new_password'}
          label={t('change_password.new_password')}
          rules={[
            global.rules.REQUIRED(t("change_password.new_password")),
            global.rules.LATEST_LENGTH(t('change_password.new_password'), 8)
          ]}
        >
          <Input.Password
            disabled={changing}
            size='large'
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
            disabled={changing}
            size='large'
            placeholder={t('placeholder.enter')}
          />
        </Form.Item>
        {
          !isReset && <Form.Item
            name="password_hint"
            label={t('auth_pages.password_hint')}
          >
            <Input.Password
              size='large'
              placeholder={t('placeholder.enter')}
              disabled={changing}
            />
          </Form.Item>
        }
        <Button
          className="mt-10 w-full"
          type="primary"
          size="large"
          htmlType="submit"
          loading={changing}
        >
          {t('button.save')}
        </Button>
      </Form>
    </div>
  );
}

export default ChangePasswordForm;
