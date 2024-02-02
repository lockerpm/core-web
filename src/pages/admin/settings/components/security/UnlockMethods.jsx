import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Divider
} from '@lockerpm/design';

import ChangePassword from "./ChangePassword";
import SecurityKey from "./SecurityKey";
import Passkey from "./Passkey";

import {
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

const UnlockMethods = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.unlock_methods.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
      </div>
      <p className="mt-1">
        {t('security.unlock_methods.description')}
      </p>
      {
        expand && <div className="mt-8">
          <ChangePassword />
          <Divider />
          <SecurityKey />
          <Divider />
          <Passkey />
        </div>
      }
    </div>
  );
}

export default UnlockMethods;
