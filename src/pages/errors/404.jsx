import React from "react";
import './css/404.scss';

import { useTranslation } from "react-i18next";
import global from "../../config/global";

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="page-not-found">
      <img src={require("../../assets/images/errors/404.jpg")} />
      <p className="content">{t('error_pages.page_not_found.title')}</p>
      <p className="note">
        <a onClick={() => {
          global.navigate(global.keys.LOCK)
        }}>{t('error_pages.page_not_found.go_back_dashboard')}</a>
      </p>
    </div>
  );
}

export default PageNotFound;