import React, { useEffect } from "react";
import './css/auth.scss';

import { Spin } from '@lockerpm/design';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import storeActions from "../../store/actions";

import authServices from "../../services/auth";
import userServices from "../../services/user";
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
        await userServices.get_account().then(async (res) => {
          const workspaces = await workspaceServices.list({ paging: 0 }) || [];
          const userPm = await userServices.user_pm();
          dispatch(storeActions.updateWorkspaces(workspaces));
          dispatch(storeActions.updateUserPm(userPm));
          dispatch(storeActions.updateUserInfo(res));
          if (userPm.is_pwd_manager) {
            global.navigate('LOCK')
          } else {
            global.navigate('CREATE_MASTER_PASSWORD')
          }
        }).catch((error) => {
          global.pushError(error)
        });
      })
    } else {
      global.navigate('LOGIN')
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