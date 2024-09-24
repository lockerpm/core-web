import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import authFormsComponents from "./forms";

const Personal = (props) => {
  const { SignInForm } = authFormsComponents;
  const {
    loading,
    onSubmit = () => {}
  } = props;
  const { t } = useTranslation();

  const [step, setStep] = useState(1);

  return (
    <div className="sign-in-personal">
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
    </div>
  );
}

export default Personal;