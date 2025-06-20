import React from "react";
import { useTranslation } from "react-i18next";

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
    loading = false,
    userInfo = {},
    isUnlockByDesktop = false,
    setIsPair = () => {},
    selectOtherMethod = () => {},
  } = props;

  return (
    <div>
      <p className="my-4 text-center">
        {t('auth_pages.sign_in.or_login_with')}
      </p>
      <div className="flex flex-col gap-2">
        {
          userInfo?.passkeys?.length > 0 && <Button
            className="w-full"
            size="large"
            ghost
            type="primary"
            icon={<KeyOutlined />}
            disabled={loading}
            onClick={() => selectOtherMethod('passkey')}
          >
            {t('auth_pages.sign_in.your_passkey')}
          </Button>
        }
        {
          userInfo?.security_keys?.length > 0 && <Button
            className="w-full"
            size="large"
            ghost
            type="primary"
            icon={<UsbOutlined />}
            disabled={loading}
            onClick={() => selectOtherMethod('security_key')}
          >
            {t('auth_pages.sign_in.your_security_key')}
          </Button>
        }
        {
          isUnlockByDesktop && <Button
            className="w-full"
            size="large"
            icon={<SyncOutlined />}
            disabled={loading}
            onClick={() => setIsPair(true)}
          >
            {t('button.sync_with_desktop')}
          </Button>
        }
      </div>
    </div>
  );
}

export default UnlockWith;