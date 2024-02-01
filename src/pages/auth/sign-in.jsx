import React, { useState } from "react";
import './css/auth.scss';

import {
  Spin
} from '@lockerpm/design';

import Logo from "./components/Logo";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import Personal from "./components/Personal";
import Enterprise from "./components/Enterprise";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import commonServices from "../../services/common";

import global from "../../config/global";

const SingIn = () => {
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.system.isLoading);
  const serverType = useSelector((state) => state.system.serverType);

  const [callingAPI, setCallingAPI] = useState(false);

  const handleSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      ...values,
      email: values.username
    }
    await commonServices.unlock_to_vault(payload);
    setCallingAPI(false)
  }

  return (
    <Spin spinning={isLoading}>
      <div
        className="auth-page"
      >
        <div
          className="sign-in"
          style={{
            backgroundImage: `url(${AuthBgImage})`,
            backgroundSize: 'contain',
            paddingTop: 62,
            paddingBottom: 16,
            height: 'max-content'
          }}
        >
          <Logo />
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
        </div>
      </div>
    </Spin>
  );
}

export default SingIn;