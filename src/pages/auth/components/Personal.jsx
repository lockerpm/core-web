import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
} from '@lockerpm/design';

import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import authFormsComponents from "./forms";

import global from "../../../config/global";

const { SignInForm } = authFormsComponents;

const Personal = (props) => {
  const {
    loading,
    onSubmit = () => {}
  } = props;
  const { t } = useTranslation();

  const [step, setStep] = useState(1);

  return (
    <div className="sign-in-personal">
      <div className="flex items-center justify-center">
        <Card
          className="w-[400px]"
          bodyStyle={{
            padding: '32px'
          }}
        >
          <div className="w-full flex items-center mb-6">
            {
              step > 1 && <Button
                className="mr-2"
                type={'text'}
                icon={<ArrowLeftOutlined />}
                onClick={() => setStep(step - 1)}
              />
            }
            <p className="text-2xl font-semibold">
              { t('auth_pages.sign_in.title') }
            </p>
          </div>
          <SignInForm
            loading={loading}
            step={step}
            onSubmit={onSubmit}
            setStep={setStep}
          />
        </Card>
      </div>
      <div className="mt-4 text-center">
        <span>
          {t('auth_pages.sign_in.note')}
          <Button
            type="link"
            className="font-semibold"
            onClick={() => global.navigate(global.keys.SIGN_UP)}
          >
            {t('auth_pages.sign_up.label')}
          </Button>
        </span>
      </div>
    </div>
  );
}

export default Personal;