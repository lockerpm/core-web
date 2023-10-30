import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
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

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.change_password.title')}
        </p>
        <Button
          type='primary'
          ghost
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
