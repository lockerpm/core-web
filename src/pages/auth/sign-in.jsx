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

import storeActions from "../../store/actions";
import authServices from "../../services/auth";
import userServices from "../../services/user";
import commonServices from "../../services/common";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import {
  convertStringToQuery
} from '../../utils/common';

import global from "../../config/global";

const SingIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [callingAPI, setCallingAPI] = useState(false);
  const locale = useSelector((state) => state.system.locale);
  const accountInfo = userServices.account_info();
  const [form] = Form.useForm();

  useEffect(() => {
    if (accountInfo) {
      form.setFieldsValue({
        username: accountInfo.username,
        password: ''
      })
    } else {
      form.setFieldsValue({
        username: '',
        password: ''
      })
    }
  }, [])

  const handleSignIn = async (values) => {
    setCallingAPI(true)
    await authServices.login(values).then(async (response) => {
      if (response.is_factor2) {
        dispatch(storeActions.updateLoginInfo({
          ...values,
          ...response
        }));
        global.navigate('OTP_CODE')
      } else {
        await commonServices.update_auth_info({ ...values, ...response })
        if (!response.is_password_changed) {
          global.navigate('CHANGE_INFORMATION', {}, {});
        } else {
          await commonServices.sync_profile()
          await Promise.all([
            commonServices.fetch_data(),
            commonServices.sync_ciphers()
          ])
        }
      }
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
              onFinish={handleSignIn}
            >
              <div className="mb-4">
                <Form.Item
                  name="username"
                  rules={[
                    global.rules.REQUIRED(t('auth_pages.username')),
                  ]}
                >
                  <Input
                    placeholder={t('auth_pages.username')}
                    size="large"
                    disabled={callingAPI}
                  />
                </Form.Item>
              </div>
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
                className="w-full mt-6"
                size="large"
                type="primary"
                htmlType="submit"
                loading={callingAPI}
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