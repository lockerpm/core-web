import React, { useEffect } from "react";
import './css/auth.scss';

import { Spin } from '@lockerpm/design';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import storeActions from "../../store/actions";

import authServices from "../../services/auth";
import global from "../../config/global";

const Authenticate = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    loginWithToken();
  }, [])

  const loginWithToken = async () => {
    const token = authServices.cs_locker_token();
    if (token) {
      authServices.update_access_token(token);
      await authServices.locker_access_token().then(async (response) => {
        authServices.update_access_token(response.access_token);
        global.navigate(global.keys.LOCK);
      })
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  }
  return (
    <div className="auth-page">
      <Spin
        spinning={true}
        size={'large'}
      >
      </Spin>
    </div>
  );
}

export default Authenticate;