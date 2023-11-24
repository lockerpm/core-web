import React, { } from "react";

import {
  Card,
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import SignInForm from "./Form";

import global from "../../../../config/global";

const Personal = (props) => {
  const {
    loading,
    onSubmit = () => {}
  } = props;
  const { t } = useTranslation();

  return (
    <div className="sign-in-personal">
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
          <SignInForm
            loading={loading}
            onSubmit={onSubmit}
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