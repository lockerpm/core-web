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

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";

const Identity = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [callingAPI, setCallingAPI] = useState(false);
  const locale = useSelector((state) => state.system.locale);
  const [form] = Form.useForm();


  const handleVerify2FA = async (values) => {
    setCallingAPI(true)
    setCallingAPI(false)
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
              <div className="flex items-center">
                <Button
                  className="w-full mr-2 mt-6"
                  size="large"
                  loading={callingAPI}
                  onClick={() => {}}
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
                  {t('button.next')}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Identity;