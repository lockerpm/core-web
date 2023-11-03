import React, { useState } from "react";
import {
  Drawer
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  ImageIcon,
  GeneratePasswordContent
} from '../../../../components'

import {
  RightOutlined
} from "@ant-design/icons";

const PasswordGenerate = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex items-center">
        <ImageIcon
          width={48}
          height={48}
          name="security-tools/pw-generator"
        />
        <div className="ml-2">
          <div
            className="flex text-primary items-center cursor-pointer"
            onClick={() => setVisible(true)}
          >
            <p className="font-semibold text-lg mr-1">
              {t('security_tools.password_generate.title')}
            </p>
            <RightOutlined />
          </div>
          <p className="mt-1">
            {t('security_tools.password_generate.description')}
          </p>
        </div>
      </div>
      <Drawer
        title={t('security_tools.password_generate.title')}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
      >
        <GeneratePasswordContent
          isFill={false}
          isShowOptions={true}
        />
      </Drawer>
    </div>
  );
}

export default PasswordGenerate;
