import React, { useState } from "react";
import {
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  ImageIcon
} from '../../../../components'

import {
  RightOutlined
} from "@ant-design/icons";

const DataBreachScanner = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [formVisible, setFormVisible] = useState(false);

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
            onClick={() => {}}
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
