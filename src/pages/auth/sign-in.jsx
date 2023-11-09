import React, { useEffect, useState } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button,
} from '@lockerpm/design';

import AuthLogo from '../../assets/images/logos/auth-logo.svg'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import authServices from "../../services/auth";
import userServices from "../../services/user";
import coreServices from "../../services/core";
import commonServices from "../../services/common";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";

const SingIn = () => {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const [form] = Form.useForm();

  const username = Form.useWatch('username', form);
  
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      username: null,
      password: null
    })
  }, [])

  const handleSubmit = async (values) => {
    setCallingAPI(true)
    await userServices.users_session({
      password: values.password,
      email: values.username
    }).then(async (response) => {
      authServices.update_access_token_type(response.token_type)
      authServices.update_access_token(response.access_token);
      await commonServices.fetch_user_info();
      await coreServices.unlock({...response, password: values.password, username: values.username })
      await commonServices.sync_data()
      global.navigate(global.keys.VAULT)
    }).catch((error) => {
      global.pushError(error)
    });
    setCallingAPI(false)
  }

  return (
    <div
      className="auth-page"
    >
      <div
        className="sign-in w-[600px]"
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
            height={48}
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
                { t('auth_pages.sign_in.title') }
              </p>
            </div>
            <Form
              form={form}
              key={locale}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="username"
                rules={[
                  global.rules.REQUIRED(t('auth_pages.username')),
                  global.rules.INVALID(t('auth_pages.username'), 'EMAIL'),
                ]}
              >
                <Input
                  placeholder={t('placeholder.username')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  global.rules.REQUIRED(t('auth_pages.password')),
                ]}
              >
                <Input.Password
                  placeholder={t('auth_pages.password')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              <Button
                className="w-full"
                size="large"
                type="primary"
                htmlType="submit"
                loading={callingAPI}
                disabled={!username}
              >
                {t('button.sign_in')}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SingIn;