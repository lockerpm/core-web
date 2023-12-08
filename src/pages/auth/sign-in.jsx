import React, { useState } from "react";
import './css/auth.scss';

import {
  Image,
  Spin
} from '@lockerpm/design';

import AuthLogo from '../../assets/images/logos/auth-logo.svg'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import Personal from "./components/sign-in/Personal";
import Enterprise from "./components/sign-in/Enterprise";

import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import authServices from "../../services/auth";
import userServices from "../../services/user";
import coreServices from "../../services/core";
import commonServices from "../../services/common";

import storeActions from "../../store/actions";

import global from "../../config/global";

const SingIn = () => {
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.system.isLoading);
  const serverType = useSelector((state) => state.system.serverType);

  const [callingAPI, setCallingAPI] = useState(false);

  const handleSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      password: values.password,
      username: values.username,
      email: values.username,
      hashedPassword: values.hashedPassword,
      keyB64: values.keyB64,
      sync_all_platforms: values.sync_all_platforms
    }
    await userServices.users_session(payload).then(async (response) => {
      if (response.is_factor2) {
        global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
        global.navigate(global.keys.OTP_CODE)
      } else {
        authServices.update_access_token_type(response.token_type)
        authServices.update_access_token(response.access_token);
        await commonServices.fetch_user_info();
        await coreServices.unlock({ ...response, ...payload });
        await commonServices.sync_data();
        if (values.sync_all_platforms) {
          await commonServices.service_login(payload);
        }
        global.navigate(global.keys.VAULT);
      }
    }).catch((error) => {
      global.pushError(error)
    }).finally(() => {
      setCallingAPI(false)
    });
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
            height: 'max-content'
          }}
        >
          <div className="flex items-center justify-center mb-8">
            <Image
              className='icon-logo'
              src={AuthLogo}
              preview={false}
              height={48}
            />
          </div>
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