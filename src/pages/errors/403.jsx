import React from "react";
import { useTranslation } from "react-i18next";

import authServices from '../../services/auth';

import './css/403.scss';

const Permission = () => {
  const { t } = useTranslation();

  return (
    <div className="permission-page">
      <img src={require("../../assets/images/errors/403.jpg")} />
      <p className="content">{t('error_pages.permission.title')}</p>
      <p className="note">
      {t('error_pages.permission.login_other_account')}
        <a onClick={() => authServices.logout(true)}> {t('common.here')}</a>
      </p>
    </div>
  );
}

export default Permission;