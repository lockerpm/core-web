import React, { useEffect, useState } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button,
  Checkbox
} from '@lockerpm/design';

import AuthLogo from '../../assets/images/logos/auth-logo.svg'

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import storeActions from "../../store/actions";
import authServices from "../../services/auth";
import coreServices from "../../services/core";
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";

const OtpCode = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [callingAPI, setCallingAPI] = useState(false);
  const locale = useSelector((state) => state.system.locale);
  const loginInfo = useSelector((state) => state.auth.loginInfo);

  const [form] = Form.useForm();

  const handleVerify2FA = async (values) => {
    setCallingAPI(true)
    const loginPayload = {
      username: loginInfo.username,
      password: loginInfo.password,
    }
    await authServices.login_by_otp({
      ...loginPayload,
      method: loginInfo.methods[0].type,
      otp: values.otp,
      save_device: values.save_device || false,
    }).then(async (response) => {
      await coreServices.unlock({
        ...loginPayload,
        ...response
      })
      setCallingAPI(false)
    }).catch((error) => {
      global.pushError(error)
      setCallingAPI(false)
    })
  }

  return (
    <div
      className="auth-page"
    >
      <div
        className="otp-code w-[600px]"
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
            <div className="w-full mb-4">
              <p className="text-2xl font-semibold">
                { t('auth_pages.otp_code.title') }
              </p>
              <p>{ t('auth_pages.otp_code.description') }</p>
            </div>
            <Form
              form={form}
              key={locale}
              onFinish={handleVerify2FA}
            >
              <Form.Item
                name="otp"
                rules={[
                  global.rules.REQUIRED(t('auth_pages.otp')),
                ]}
              >
                <Input
                  placeholder={t('placeholder.otp')}
                  size="large"
                  disabled={callingAPI}
                />
              </Form.Item>
              <Form.Item
                name="save_device"
                noStyle
                valuePropName="checked"
              >
                <Checkbox>
                  {t('auth_pages.otp_code.remember_device')}
                </Checkbox>
              </Form.Item>
              <div className="flex items-center">
                <Button
                  className="w-full mr-2 mt-6"
                  size="large"
                  disabled={callingAPI}
                  onClick={() => global.navigate(global.keys.SIGN_IN)}
                >
                  {t('button.back')}
                </Button>
                <Button
                  className="w-full mt-6"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={callingAPI}
                >
                  {t('button.verify')}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OtpCode;