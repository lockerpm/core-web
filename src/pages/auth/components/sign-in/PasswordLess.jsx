import React, { } from "react";

import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

const PasswordLess = (props) => {
  const {
  } = props;
  const { t } = useTranslation();

  const isDesktop = false;

  return (
    <div className="sign-in-password-less">
      {
        isDesktop ? <div>
          <p>{t('auth_pages.password_less.note3')}</p>
          <Button
            className="w-full mt-4"
            size="large"
            type="primary"
          >
            {t('auth_pages.password_less.sign_in_desktop')}
          </Button>
        </div> : <div>
          <p className="mb-2">{t('auth_pages.password_less.note1')}</p>
          <p>{t('auth_pages.password_less.note2')}</p>
          <Button
            className="w-full mt-4"
            size="large"
            type="primary"
          >
            {t('auth_pages.password_less.download_desktop')}
          </Button>
        </div>
      }
    </div>
  );
}

export default PasswordLess;