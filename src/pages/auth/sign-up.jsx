import React, { useState } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button
} from '@lockerpm/design';

import AuthLogo from '../../assets/images/logos/auth-logo.svg'
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import userServices from "../../services/user";
import authServices from "../../services/auth";
import coreServices from "../../services/core";
import commonServices from "../../services/common";

import global from "../../config/global";

const SingUp = () => {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const serverType = useSelector((state) => state.system.serverType);

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  const handleSignUp = async (values) => {
    setCallingAPI(true)
    await userServices.register(values).then(async () => {
      await userServices.users_session({
        password: values.password,
        email: values.username
      }).then(async (response) => {
        authServices.update_access_token_type(response.token_type)
        authServices.update_access_token(response.access_token);
        await commonServices.fetch_user_info();
        await coreServices.unlock({ ...response, ...values })
        await commonServices.sync_data()
        global.navigate(global.keys.VAULT)
      }).catch((error) => {
        global.pushError(error)
      });
    }).catch((error) => {
      global.pushError(error)
    });
    setCallingAPI(false)
  }

  return (
    <div className="auth-page">
      <div
        className="sign-up"
        style={{
          backgroundImage: `url(${AuthBgImage})`,
          backgroundSize: 'contain',
          paddingTop: 62,
          height: 'max-content'
        }}
      >
        <div className="flex items-center justify-center mb-8">
          <Image
            className='icon-logo'
            src={AuthLogo}
            preview={false}
          />
        </div>
        <div className="flex items-center justify-center">
          <Card
            className="w-[400px]"
            bodyStyle={{
              padding: '32px'
            }}
          >
            <div className="w-full flex items-center justify-between mb-4">
              <p className="text-2xl font-semibold">
                {t('auth_pages.sign_up.title')}
              </p>
            </div>
            <Form
              form={form}
              key={locale}
              initialValues={
                {
                  username: null,
                  password: null,
                  confirm_password: null,
                  password_hint: null
                }
              }
              onFinish={handleSignUp}
            >
              <div className="mb-4">
                <Form.Item
                  name="username"
                  rules={[
                    global.rules.REQUIRED(t('auth_pages.username')),
                    global.rules.INVALID(t('auth_pages.username'), 'email')
                  ]}
                >
                  <Input
                    placeholder={t('auth_pages.username')}
                    size="large"
                    disabled={callingAPI}
                  />
                </Form.Item>
              </div>
              <div className="mb-4">
                <Form.Item
                  name="password"
                  rules={[
                    global.rules.REQUIRED(t('auth_pages.password')),
                    global.rules.LATEST_LENGTH(t('auth_pages.password'), 8)
                  ]}
                >
                  <Input.Password
                    placeholder={t('auth_pages.password')}
                    size="large"
                    disabled={callingAPI}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="confirm_password"
                rules={[
                  global.rules.REQUIRED(t('auth_pages.confirm_password')),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('validation.passwords_not_match')));
                    },
                  })
                ]}
              >
                <Input.Password
                  placeholder={t('auth_pages.confirm_password')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              <Form.Item
                name="password_hint"
              >
                <Input.Password
                  placeholder={t('auth_pages.password_hint')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              <Button
                className="w-full mt-6"
                size="large"
                type="primary"
                htmlType="submit"
                loading={callingAPI}
              >
                {t('button.sign_up')}
              </Button>
            </Form>
          </Card>
        </div>
        {
          serverType === global.constants.SERVER_TYPE.PERSONAL && <div className="mt-4 text-center">
            <span>
              {t('auth_pages.sign_up.note')}
              <Button
                type="link"
                className="font-semibold"
                onClick={() => global.navigate(global.keys.SIGN_IN)}
              >
                {t('auth_pages.sign_in.label')}
              </Button>
            </span>
          </div>
        }
      </div>
    </div>
  );
}

export default SingUp;