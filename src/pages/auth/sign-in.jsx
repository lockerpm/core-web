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

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import authServices from "../../services/auth";
import userServices from "../../services/user";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";

const SingIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const [form] = Form.useForm();

  const username = Form.useWatch('username', form);
  
  const [callingAPI, setCallingAPI] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
      username: null,
      password: null
    })
  }, [])

  useEffect(() => {
    setAuthMethod(null)
  }, [username])

  const handleSubmit = async (values) => {
    setCallingAPI(true)
    if (!authMethod) {
      await handleAuthMethod(values)
    } else {
      await handleSignIn(values)
    }
    setCallingAPI(false)
  }

  const handleAuthMethod = async (values) => {
    setCallingAPI(true)
    await authServices.auth_method({
      username: values.username
    }).then(async (response) => {
      setAuthMethod(response)
    }).catch((error) => {
      global.pushError(error)
    });
  }

  const handleSignIn = async (values) => {
    await authServices.login({
      ...values,
      language: locale
    }).then(async (response) => {
      authServices.update_access_token(response.token)
      global.navigate(global.keys.LOCK)
    }).catch((error) => {
      global.pushError(error)
    });
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
                ]}
              >
                <Input
                  placeholder={t('placeholder.username')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              {
                authMethod && <Form.Item
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
              }
              <Button
                className="w-full"
                size="large"
                type="primary"
                htmlType="submit"
                loading={callingAPI}
                disabled={!username}
              >
                { authMethod ? t('button.sign_in') : t('button.continue')}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SingIn;