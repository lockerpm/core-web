import React, { useState } from "react";
import {
  Divider
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import ChangePassword from "./ChangePassword";
import Passwordless from "./Passwordless";
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
  const isDesktop = useSelector((state) => state.system.isDesktop)
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
          <Passwordless />
          {
            !isDesktop && <div>
              <Divider />
              <Passkey />
            </div>
          }
        </div>
      }
    </div>
  );
}

export default UnlockMethods;
