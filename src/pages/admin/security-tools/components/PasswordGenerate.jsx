import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Drawer
} from '@lockerpm/design';

import {
  RightOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";
import commonComponents from "../../../../components/common";

const PasswordGenerate = (props) => {
  const { ImageIcon } = itemsComponents;
  const { GenerateOptions } = commonComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();

  const currentPage = useSelector(state => state.system.currentPage)

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentPage?.query?.is_generator == 1) {
      setVisible(true);
    }
  }, [
    currentPage.query?.is_generator
  ])

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
        <GenerateOptions
          isFill={false}
          isShowOptions={true}
        />
      </Drawer>
    </div>
  );
}

export default PasswordGenerate;
