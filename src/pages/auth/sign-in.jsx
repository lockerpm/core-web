import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Spin
} from '@lockerpm/design';

import authComponents from "./components";

import global from "../../config/global";
import common from "../../utils/common";

const SingIn = () => {
  const { t } = useTranslation();
  const { AuthCard, Personal, Enterprise } = authComponents;
  const isLoading = useSelector((state) => state.system.isLoading);
  const serverType = useSelector((state) => state.system.serverType);

  const [callingAPI, setCallingAPI] = useState(false);

  const handleSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      ...values,
      email: values.username
    }
    await common.unlockToVault(payload);
    setCallingAPI(false)
  }

  return (
    <Spin spinning={isLoading}>
      <div
        className="auth-page"
      >
        <AuthCard
          other={
            serverType === global.constants.SERVER_TYPE.PERSONAL && <div className="mt-4 text-center">
              <span>
                {t('auth_pages.sign_in.note')}
                <Button
                  type="link"
                  className="font-semibold"
                  onClick={() => global.navigate(global.keys.SIGN_UP)}
                >
                  {t('auth_pages.sign_up.label')}
                </Button>
              </span>
            </div>
          }
        >
          {
            !isLoading && <div>
              {
                serverType === global.constants.SERVER_TYPE.PERSONAL && <Personal
                  loading={callingAPI}
                  onSubmit={handleSignIn}
                />
              }
              {
                serverType === global.constants.SERVER_TYPE.ENTERPRISE && <Enterprise
                  loading={callingAPI}
                  onSubmit={handleSignIn}
                />
              }
            </div>
          }
        </AuthCard>
      </div>
    </Spin>
  );
}

export default SingIn;