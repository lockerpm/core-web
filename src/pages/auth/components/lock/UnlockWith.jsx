import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from 'react-router-dom';

import {
  Button,
} from '@lockerpm/design';

import {
  KeyOutlined,
  UsbOutlined
} from "@ant-design/icons";

const UnlockWith = (props) => {
  const { t } = useTranslation();
  const {
    logging = false,
    loading = false,
    callingAPI = false,
    userInfo = {},
    selectOtherMethod = () => {},
    handleLogout = () => {}
  } = props;

  return (
    <div>
      <Button
        className="w-full"
        size="large"
        ghost
        type="primary"
        icon={<KeyOutlined />}
        disabled={loading || callingAPI}
        onClick={() => selectOtherMethod('passkey')}
      >
        {t('auth_pages.sign_in.your_passkey')}
      </Button>
      <Button
        className="w-full mt-2"
        size="large"
        ghost
        type="primary"
        icon={<UsbOutlined />}
        disabled={loading || callingAPI}
        onClick={() => selectOtherMethod('security_key')}
      >
        {t('auth_pages.sign_in.your_security_key')}
      </Button>
      {
        !callingAPI && userInfo?.login_method !== 'password' && <Button
          className="w-full mt-6"
          size="large"
          htmlType="submit"
          loading={logging}
          onClick={() => handleLogout()}
        >
          {t('sidebar.logout')}
        </Button>
      }
    </div>
  );
}

export default UnlockWith;