import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Button
} from '@lockerpm/design';

import authComponents from "./components";

import userServices from "../../services/user";
import coreServices from "../../services/core";
import commonServices from "../../services/common";

import global from "../../config/global";
import common from "../../utils/common";

import './css/auth.scss';

const SingUp = () => {
  const { AuthCard } = authComponents;
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const serverType = useSelector((state) => state.system.serverType);
  const isConnected = useSelector((state) => state.service.isConnected)

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  const handleSignUp = async (values) => {
    setCallingAPI(true)
    await userServices.register(values).then(async () => {
      await userServices.users_session({
        password: values.password,
        email: values.username
      }).then(async (response) => {
        common.updateAccessTokenType(response.token_type)
        common.updateAccessToken(response.access_token);
        await common.fetchUserInfo();
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

  const signOtherAccount = () => {
    common.updateSsoAccount(null);
    if (isConnected) {
      service.setCacheData({})
    }
    global.navigate(global.keys.SIGN_IN)
  }

  return (
    <div className="auth-page">
      <AuthCard
        other={
          serverType === global.constants.SERVER_TYPE.PERSONAL && <div className="mt-4 text-center">
            <span>
              {t('auth_pages.sign_up.note')}
              <Button
                type="link"
                className="font-semibold"
                onClick={() => signOtherAccount()}
              >
                {t('auth_pages.sign_in.label')}
              </Button>
            </span>
          </div>
        }
      >
        <>
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
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && getFieldValue('password') === value) {
                      return Promise.reject(new Error(t('validation.invalid', { name: t('auth_pages.password_hint') })));
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
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
        </>
      </AuthCard>
    </div>
  );
}

export default SingUp;