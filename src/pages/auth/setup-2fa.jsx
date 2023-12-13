import React, { useEffect, useState, useMemo } from "react";
import './css/auth.scss';

import {
  Image,
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
import { useNavigate } from 'react-router-dom';

import AuthLogo from '../../assets/images/logos/auth-logo.svg';

import authServices from "../../services/auth";
import userServices from "../../services/user";
import coreServices from "../../services/core";
import commonServices from "../../services/common";
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";
import common from "../../utils/common";

import { green } from '@ant-design/colors';

const Setup2FA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const locale = useSelector((state) => state.system.locale);
  const factor2 = useSelector((state) => state.auth.factor2);

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState(null);

  const query = common.convertStringToQuery(window.location.search);

  useEffect(() => {
    setIdentity(factor2?.mail_otp ? global.constants.FACTOR2_IDENTITY.MAIL : global.constants.FACTOR2_IDENTITY.SMART_OTP)
  }, [factor2])

  const handleEnabled2FA = async () => {
    form.validateFields().then(async (values) => {
      const payload = {
        ...factor2,
        method: identity,
        otp: values.otp,
        save_device: values.save_device || false,
      }
      setCallingAPI(true)
      await userServices.users_session_otp(payload).then(async (response) => {
        authServices.update_access_token_type(response.token_type)
        authServices.update_access_token(response.access_token);
        await commonServices.fetch_user_info();
        await coreServices.unlock({ ...response, ...payload })
        await commonServices.sync_data();
        const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
        navigate(returnUrl);
      }).catch((error) => {
        global.pushError(error)
      })
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
            {
              step === 0 && <div>
                <div className="w-full mb-4">
                  <p className="text-2xl font-semibold">
                    {t('auth_pages.setup_2fa.title')}
                  </p>
                  <p>{t('auth_pages.setup_2fa.description')}</p>
                </div>
                <div>
                  <Radio.Group
                    name="radiogroup"
                    value={identity}
                    className="w-full"
                    onChange={(e) => setIdentity(e.target.value)}
                  >
                    {
                      factor2?.mail_otp && <Card
                        className="w-full cursor-pointer"
                        bodyStyle={{ padding: 12 }}
                        style={{ borderColor: identity === global.constants.FACTOR2_IDENTITY.MAIL ? green[6] : '' }}
                        onClick={() => setIdentity(global.constants.FACTOR2_IDENTITY.MAIL)}
                      >
                        <Radio value={global.constants.FACTOR2_IDENTITY.MAIL}>
                          <div className="flex items-center">
                            <MailOutlined />
                            <p className="ml-2">
                              {t('security.two_fa.smart_otp.name')}
                            </p>
                          </div>
                        </Radio>
                      </Card>
                    }
                    <Card
                      className="w-full cursor-pointer mt-4"
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
                  </Radio.Group>
                </div>
              </div>
            }
            {
              step === 1 && <div>
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
                  onClick={() => handleEnabled2FA()}
                >
                  {t('button.verify')}
                </Button>
              }
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Setup2FA;