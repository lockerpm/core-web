import React from "react";
import { useTranslation } from "react-i18next";

import global from "../../config/global";

const DataNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="page-not-found" style={{ width: '100%', height: '100%' }}>
      <img src={require("../../assets/images/errors/404.jpg")} />
      <p className="content">{t('common.data_not_found')}</p>
      <p className="note">
        <a onClick={() => {
          global.navigate(global.keys.VAULT)
        }}>{t('common.go_back_inventory')}</a>
      </p>
    </div>
  );
}

export default DataNotFound;