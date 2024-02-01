import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Card,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import authComponents from "./components";

import images from "../../assets/images";

import commonServices from "../../services/common";
import authServices from "../../services/auth";

import global from "../../config/global";
import common from "../../utils/common";

import './css/auth.scss';

const OtpCode = () => {
  const { Logo, EnterOtp } = authComponents;
  const { AuthBgImage } = images;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const factor2 = useSelector((state) => state.auth.factor2);
  const isConnected = useSelector((state) => state.service.isConnected);

  const [callingAPI, setCallingAPI] = useState(false);

  const query = common.convertStringToQuery(location.search);

  const onVerify = async (payload) => {
    setCallingAPI(true)
    await commonServices.unlock_to_vault({ ...payload, is_otp: true }, query, () => {
      const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
      navigate(returnUrl);
    })
    setCallingAPI(false)
  }

  const signOtherAccount = () => {
    authServices.update_sso_account(null);
    if (isConnected) {
      service.setCacheData({})
    }
    global.navigate(global.keys.BACK)
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
              onBack={() => signOtherAccount()}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OtpCode;