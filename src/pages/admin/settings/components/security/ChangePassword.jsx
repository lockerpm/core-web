import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import ChangePasswordFormData from "./form-data/ChangePassword";

import {
  KeyOutlined,
} from "@ant-design/icons";

const ChangePassword = (props) => {
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
          {t('security.change_password.title')}
        </p>
        <Button
          type='primary'
          ghost
          disabled={userInfo.is_require_passwordless || userInfo?.login_method === 'passwordless'}
          icon={<KeyOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('change_password.title')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.change_password.description')}
      </p>
      <ChangePasswordFormData
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default ChangePassword;
