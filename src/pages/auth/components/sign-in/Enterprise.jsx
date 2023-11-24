import React, { useEffect, useState } from "react";

import {
  Card,
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import SignInForm from "./Form";

import {
} from "@ant-design/icons";

const Enterprise = (props) => {
  const {
    loading,
    onSubmit = () => {}
  } = props;
  const { t } = useTranslation();

  const [step, setStep] = useState(0);

  const handleSingleSignOn = () => {
    // redirect sso
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
          <div className="w-full flex items-center justify-between mb-6">
            <p className="text-2xl font-semibold">
              { t('auth_pages.sign_in.title') }
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
            step === 1 && <div>
              <SignInForm
                loading={loading}
                onSubmit={onSubmit}
              />
              {
                !loading && <Button
                  type='text'
                  className="w-full mt-3 text-primary"
                  size="large"
                  onClick={() => setStep(0)}
                >
                  {t('button.go_back')}
                </Button>
              }
            </div>
          }
        </Card>
      </div>
    </div>
  );
}

export default Enterprise;