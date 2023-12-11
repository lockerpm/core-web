import React, { useEffect, useState } from "react";

import {
  Card,
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import SignInForm from "./Form";

import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import ssoConfigServices from "../../../../services/sso-config";

const Enterprise = (props) => {
  const {
    loading,
    onSubmit = () => { }
  } = props;
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [existed, setExisted] = useState(false);

  useEffect(() => {
    checkExist();
  }, [])

  const checkExist = async () => {
    const response = await ssoConfigServices.check_exists();
    setExisted(response?.existed)
    if (response?.existed) {
      setStep(0)
    } else {
      setStep(1)
    }
  }

  const handleSingleSignOn = () => {
    setStep(1)
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <Card
          className="w-[400px]"
          bodyStyle={{
            padding: '32px'
          }}
        >
          <div className="w-full flex items-center mb-6">
            {
              ((step > 0 && existed) || step > 1) && <Button
                className="mr-2"
                type={'text'}
                icon={<ArrowLeftOutlined />}
                onClick={() => setStep(step - 1)}
              />
            }
            <p className="text-2xl font-semibold">
              {t('auth_pages.sign_in.title')}
            </p>
          </div>
          {
            step === 0 && <Button
              className="w-full"
              size="large"
              type="primary"
              loading={loading}
              onClick={handleSingleSignOn}
            >
              {t('auth_pages.sign_in.single_sign_on')}
            </Button>
          }
          {
            step > 0 && <div>
              <SignInForm
                loading={loading}
                step={step}
                onSubmit={onSubmit}
                setStep={setStep}
              />
            </div>
          }
        </Card>
      </div>
    </div>
  );
}

export default Enterprise;