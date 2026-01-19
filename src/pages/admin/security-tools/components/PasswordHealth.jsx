import React from "react";
import { useTranslation } from "react-i18next";

import {
  RightOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";

import global from "../../../../config/global";

const PasswordHealth = (props) => {
  const { ImageIcon } = itemsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-center">
        <ImageIcon
          width={48}
          height={48}
          name="security-tools/pw-health"
        />
        <div className="ml-2">
          <div
            className="flex text-primary items-center cursor-pointer"
            onClick={() => global.navigate(global.keys.PASSWORD_HEALTH)}
          >
            <p className="font-semibold text-lg mr-1">
              {t('security_tools.password_health.title')}
            </p>
            <RightOutlined />
          </div>
          <p className="mt-1">
            {t('security_tools.password_health.description')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordHealth;
