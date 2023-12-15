import React, { useEffect, useState, useMemo } from "react";
import './css/auth.scss';

import {
  Card,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import Logo from "./components/Logo";
import EnterOtp from "./components/otp-code/EnterOtp";

import authServices from "../../services/auth";
import userServices from "../../services/user";
import coreServices from "../../services/core";
import commonServices from "../../services/common";
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import global from "../../config/global";
import common from "../../utils/common";

const OtpCode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const factor2 = useSelector((state) => state.auth.factor2);

  const [callingAPI, setCallingAPI] = useState(false);

  const query = common.convertStringToQuery(window.location.search);

  const onVerify = async (payload) => {
    setCallingAPI(true)
    await userServices.users_session_otp(payload).then(async (response) => {
      authServices.update_access_token_type(response.token_type)
      authServices.update_access_token(response.access_token);
      await commonServices.fetch_user_info();
      await coreServices.unlock({ ...response, ...payload })
      await commonServices.sync_data();
      const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
      navigate(returnUrl);
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  return (
    <div
      className="auth-page"
    >
      <div
        className="otp-code w-[600px]"
        style={{
          backgroundImage: `url(${AuthBgImage})`,
          backgroundSize: 'contain',
          paddingTop: 62,
          height: 'max-content'
        }}
      >
        <Logo />
        <div className="flex items-center justify-center">
          <Card
            className="w-[400px]"
            bodyStyle={{
              padding: '32px'
            }}
          >
            <EnterOtp
              callingAPI={callingAPI}
              factor2={factor2}
              isAuth={true}
              onVerify={onVerify}
              onBack={() => global.navigate(global.keys.BACK)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OtpCode;