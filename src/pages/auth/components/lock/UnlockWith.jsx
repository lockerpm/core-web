import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from 'react-router-dom';

import {
  Button,
} from '@lockerpm/design';

import {
  KeyOutlined,
  UsbOutlined,
  SyncOutlined
} from "@ant-design/icons";

const UnlockWith = (props) => {
  const { t } = useTranslation();
  const {
    logging = false,
    loading = false,
    callingAPI = false,
    showMpForm = false,
    userInfo = {},
    setIsPair = () => {},
    selectOtherMethod = () => {},
    onLogout = () => {},
  } = props;

  const isUnlockWith = useMemo(() => {
    return userInfo?.passkeys.length > 0 || userInfo?.security_keys.length > 0 || userInfo?.sync_all_platforms
  }, [userInfo])

  return (
    <div>
      {
        isUnlockWith && <p className="my-4 text-center">
          {t('auth_pages.sign_in.or_login_with')}
        </p>
      }
      {
        userInfo?.passkeys?.length > 0 && <Button
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
      }
      {
        userInfo?.security_keys?.length > 0 && <Button
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
      }
      {
        userInfo?.sync_all_platforms && <Button
          className="w-full mt-2"
          size="large"
          icon={<SyncOutlined />}
          disabled={loading || callingAPI}
          onClick={() => setIsPair(true)}
        >
          {t('button.sync_with_desktop')}
        </Button>
      }
      {
        !callingAPI && !showMpForm && <Button
          className="w-full mt-6"
          size="large"
          htmlType="submit"
          loading={logging}
          onClick={onLogout}
        >
          {t('sidebar.logout')}
        </Button>
      }
    </div>
  );
}

export default UnlockWith;