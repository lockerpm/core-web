import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import {
  QrcodeOutlined,
} from "@ant-design/icons";

const MobilePasswordless = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [formVisible, setFormVisible] = useState(false);
  
  const userInfo = useSelector(state => state.auth.userInfo);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.mobile_passwordless.title')}
        </p>
        <Button
          type='primary'
          ghost
          icon={<QrcodeOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('security.mobile_passwordless.action')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.mobile_passwordless.description')}
      </p>
    </div>
  );
}

export default MobilePasswordless;
