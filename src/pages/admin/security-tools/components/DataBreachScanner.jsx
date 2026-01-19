import React from "react";

import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
  RightOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";

import global from "../../../../config/global";

const DataBreachScanner = (props) => {
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
          name="security-tools/pw-breach"
        />
        <div className="ml-2">
          <div
            className="flex text-primary items-center cursor-pointer"
            onClick={() => global.navigate(global.keys.BREACH_SCANNER)}
          >
            <p className="font-semibold text-lg mr-1">
              {t('security_tools.data_breach_scanner.title')}
            </p>
            <RightOutlined />
          </div>
          <p className="mt-1">
            {t('security_tools.data_breach_scanner.description')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DataBreachScanner;
