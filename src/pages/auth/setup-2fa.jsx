import React, { useEffect, useState, useMemo } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Button,
  Radio
} from '@lockerpm/design';

import {
  MobileOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { SmartOtpForm, MailOtpForm } from "../../components";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import Logo from "./components/Logo";

import authServices from "../../services/auth";
import commonServices from "../../services/common";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";

import { green } from '@ant-design/colors';

const Setup2FA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const factor2 = useSelector((state) => state.auth.factor2);

  const [callingAPI, setCallingAPI] = useState(false);
  const [step, setStep] = useState(0);
  const [mailStep, setMailStep] = useState(0);
  const [identity, setIdentity] = useState(null);
  const [isSentTo, setIsSentTo] = useState(false);
  const [otp, setOtp] = useState('')

  useEffect(() => {
    setIdentity(factor2?.mail_otp ? global.constants.FACTOR2_IDENTITY.MAIL : global.constants.FACTOR2_IDENTITY.SMART_OTP)
    authServices.update_access_token(factor2?.token)
  }, [factor2])

  const handleEnabled2FA = async () => {
    setCallingAPI(true);
    await authServices.update_factor2({
      method: identity,
      otp: otp
    }).then(async () => {
      global.pushSuccess(t('notification.success.factor2.enabled'));
      await commonServices.unlock_to_vault(factor2)
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  const handleNext = async () => {
    if (identity === global.constants.FACTOR2_IDENTITY.MAIL) {
      setCallingAPI(true);
      await authServices.factor2_activate_code({
        method: identity,
      }).then(() => {
        setIsSentTo(true);
        setStep(1);
        setMailStep(1);
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    } else {
      setStep(1)
    }
  }

  return (
    <div
      className="auth-page"
    >
      <div
        className="otp-code w-[600px] pb-10"
        style={{
          backgroundImage: `url(${AuthBgImage})`,
          backgroundSize: 'contain',
          paddingTop: 62,
          height: 'max-content'
        }}
      >
        <Logo />
        <div className="flex items-center justify-center">
          <Card
            className="w-[600px]"
            bodyStyle={{
              padding: '32px'
            }}
          >
            <div className="w-full mb-4">
              <p className="text-2xl font-semibold">
                {t('auth_pages.setup_2fa.title')}
              </p>
              {
                step === 0 && <p>{t('auth_pages.setup_2fa.description')}</p>
              }
            </div>
            {
              step === 0 && <div>
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
                              {t('security.two_fa.email_otp.name')}
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
                {
                  identity === global.constants.FACTOR2_IDENTITY.MAIL && <MailOtpForm
                    userInfo={factor2}
                    step={mailStep}
                    isSentTo={isSentTo}
                    callingAPI={callingAPI}
                    otp={otp}
                    setStep={setMailStep}
                    setOtp={setOtp}
                  />
                }
                {
                  identity === global.constants.FACTOR2_IDENTITY.SMART_OTP && <SmartOtpForm
                    callingAPI={callingAPI}
                    smartOtp={factor2?.smart_otp}
                    otp={otp}
                    setOtp={setOtp}
                  />
                }
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
                  onClick={() => handleNext()}
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
                  {t('button.enable')}
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