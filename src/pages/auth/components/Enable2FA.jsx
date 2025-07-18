import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
  Radio
} from '@lockerpm/design';

import {
  MobileOutlined,
  MailOutlined,
} from "@ant-design/icons";

import formsComponents from "../../../components/forms";

import authServices from "../../../services/auth";

import global from "../../../config/global";
import common from "../../../utils/common";

const Enable2FA = (props) => {
  const { SmartOtp, MailOtp } = formsComponents;
  const { t } = useTranslation();
  const {
    factor2,
    callingAPI = false,
    setCallingAPI = () => { },
    onEnable = () => { },
    onBack = () => { }
  } = props;

  const [step, setStep] = useState(0);
  const [mailStep, setMailStep] = useState(0);
  const [identity, setIdentity] = useState(null);
  const [isSentTo, setIsSentTo] = useState(false);
  const [otp, setOtp] = useState('')

  useEffect(() => {
    initEnabled2FA();
  }, [factor2])

  const initEnabled2FA = async () => {
    setIdentity(factor2?.mail_otp ? global.constants.FACTOR2_IDENTITY.MAIL : global.constants.FACTOR2_IDENTITY.SMART_OTP)
    await common.updateAccessToken(factor2?.token)
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
    <div>
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
                  className={`w-full cursor-pointer ${identity === global.constants.FACTOR2_IDENTITY.MAIL ? 'border-primary' : ''}`}
                  bodyStyle={{ padding: 12 }}
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
                className={`w-full cursor-pointer mt-4 ${identity === global.constants.FACTOR2_IDENTITY.SMART_OTP ? 'border-primary' : ''}`}
                bodyStyle={{ padding: 12 }}
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
            identity === global.constants.FACTOR2_IDENTITY.MAIL && <MailOtp
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
            identity === global.constants.FACTOR2_IDENTITY.SMART_OTP && <SmartOtp
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
              onBack();
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
            onClick={() => onEnable({
              method: identity,
              otp: otp
            })}
          >
            {t('button.enable')}
          </Button>
        }
      </div>
    </div>
  );
}

export default Enable2FA;