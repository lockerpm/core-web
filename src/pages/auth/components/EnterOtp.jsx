import React, { useEffect, useState, useMemo } from "react";

import {
  Card,
  Input,
  Form,
  Button,
  Checkbox,
  Radio
} from '@lockerpm/design';

import {
  MobileOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../config/global";

import { green } from '@ant-design/colors';

const EnterOtp = (props) => {
  const { t } = useTranslation();
  const {
    className,
    isAuth = false,
    callingAPI = false,
    factor2 = {},
    onVerify = () => { }
  } = props

  const locale = useSelector((state) => state.system.locale);

  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    setIdentity(factor2?.methods[0]?.method)
  }, [factor2])

  const smartOtp = useMemo(() => {
    return factor2?.methods?.find((m) => m.method === global.constants.FACTOR2_IDENTITY.SMART_OTP)
  }, [factor2])

  const mailOtp = useMemo(() => {
    return factor2?.methods?.find((m) => m.method === global.constants.FACTOR2_IDENTITY.MAIL)
  }, [factor2])

  const handleVerify2FA = async () => {
    form.validateFields().then(async (values) => {
      const payload = {
        ...factor2,
        method: identity,
        otp: values.otp,
        save_device: values.save_device || false,
      }
      onVerify(payload)
    })
  }

  return (
    <div className={className}>
      {
        step === 0 && <div>
          <div className="w-full mb-4">
            {
              isAuth && <p className="text-2xl font-semibold">
                {t('auth_pages.otp_code.sign_in_account')}
              </p>
            }
            <p>{t('auth_pages.otp_code.verify_identity')}</p>
          </div>
          <div>
            <Radio.Group
              name="radiogroup"
              value={identity}
              className="w-full"
              onChange={(e) => setIdentity(e.target.value)}
            >
              {
                mailOtp?.is_active && <Card
                  className="w-full mb-3 cursor-pointer"
                  bodyStyle={{ padding: 12 }}
                  style={{ borderColor: identity === global.constants.FACTOR2_IDENTITY.MAIL ? green[6] : '' }}
                  onClick={() => setIdentity(global.constants.FACTOR2_IDENTITY.MAIL)}
                >
                  <Radio value={global.constants.FACTOR2_IDENTITY.MAIL}>
                    <div className="flex items-center">
                      <MailOutlined />
                      <p className="ml-2">
                        {t('security.two_fa.email_otp.name')}
                      </p>
                    </div>
                  </Radio>
                </Card>
              }
              {
                smartOtp?.is_active && <Card
                  className="w-full cursor-pointer"
                  bodyStyle={{ padding: 12 }}
                  style={{ borderColor: identity === global.constants.FACTOR2_IDENTITY.SMART_OTP ? green[6] : '' }}
                  onClick={() => setIdentity(global.constants.FACTOR2_IDENTITY.SMART_OTP)}
                >
                  <Radio value={global.constants.FACTOR2_IDENTITY.SMART_OTP}>
                    <div className="flex items-center">
                      <MobileOutlined />
                      <p className="ml-2">
                        {t('security.two_fa.smart_otp.name')}
                      </p>
                    </div>
                  </Radio>
                </Card>
              }
            </Radio.Group>
          </div>
        </div>
      }
      {
        step === 1 && <div>
          <div className="w-full mb-4">
            {
              isAuth && <p className="text-2xl font-semibold">
                {t('auth_pages.otp_code.title')}
              </p>
            }
            <p>{t('auth_pages.otp_code.description')}</p>
          </div>
          <Form
            form={form}
            key={locale}
            disabled={callingAPI}
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
          </Form>
        </div>
      }
      <div className="flex items-center">
        <Button
          className="w-full mr-2 mt-6"
          size="large"
          disabled={callingAPI}
          onClick={() => {
            if (step === 0) {
              global.navigate(global.keys.BACK);
            } else {
              setStep(0)
            }
          }}
        >
          {t('button.back')}
        </Button>
        {
          step === 0 && <Button
            className="w-full mt-6"
            size="large"
            type="primary"
            loading={callingAPI}
            onClick={() => setStep(1)}
          >
            {t('button.next')}
          </Button>
        }
        {
          step === 1 && <Button
            className="w-full mt-6"
            size="large"
            type="primary"
            loading={callingAPI}
            onClick={() => handleVerify2FA()}
          >
            {t('button.verify')}
          </Button>
        }
      </div>
    </div>
  );
}

export default EnterOtp;