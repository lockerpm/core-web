import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { } from "react-i18next";
import { useNavigate, useLocation } from 'react-router-dom';

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import authComponents from "./components";

import global from "../../config/global";
import common from "../../utils/common";

import './css/auth.scss';

const OtpCode = () => {
  const { AuthCard, EnterOtp } = authComponents;
  const navigate = useNavigate();
  const location = useLocation();

  const factor2 = useSelector((state) => state.auth.factor2);
  const isConnected = useSelector((state) => state.service.isConnected);

  const [callingAPI, setCallingAPI] = useState(false);

  const query = common.convertStringToQuery(location.search);

  const onVerify = async (payload) => {
    setCallingAPI(true)
    await common.unlockToVault({ ...payload, is_otp: true }, query, () => {
      const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
      navigate(returnUrl);
    })
    setCallingAPI(false)
  }

  const signOtherAccount = () => {
    common.updateSsoAccount(null);
    if (isConnected) {
      service.setCacheData({})
    }
    global.navigate(global.keys.BACK)
  }

  return (
    <div
      className="auth-page"
    >
      <AuthCard>
        <EnterOtp
          callingAPI={callingAPI}
          factor2={factor2}
          isAuth={true}
          onVerify={onVerify}
          onBack={() => signOtherAccount()}
        />
      </AuthCard>
    </div>
  );
}

export default OtpCode;