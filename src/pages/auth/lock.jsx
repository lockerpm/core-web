/* eslint-disable no-import-assign */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Spin
} from '@lockerpm/design';

import authComponents from "./components";

import commonServices from "../../services/common";
import authServices from "../../services/auth";

import common from "../../utils/common";
import global from "../../config/global";

const Lock = () => {
  const { AuthCard, LockForm } = authComponents;
  
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.system.isLoading);
  const isConnected = useSelector((state) => state.service.isConnected)
  const isDesktopConnected = useSelector((state) => state.service.isDesktopConnected)
  const cacheData = useSelector((state) => state.service.cacheData);

  const [loading, setLoading] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [logging, setLogging] = useState(false);
  const [isPair, setIsPair] = useState(false)
  const [serviceUser, setServiceUser] = useState(false)
  const [step, setStep] = useState(0);
  const [otherMethod, setOtherMethod] = useState(null)

  const query = common.convertStringToQuery(location.search);

  const isUnlockByDesktop = useMemo(() => {
    return userInfo?.sync_all_platforms && cacheData?.email === userInfo?.email && !!cacheData?.unlock_method
  }, [userInfo?.sync_all_platforms, userInfo?.email, cacheData, isConnected])

  useEffect(() => {
    initState();
    fetchData();
  }, [])

  useEffect(() => {
    if (userInfo?.email) {
      if (!userInfo?.is_factor2 && userInfo?.require_2fa && userInfo?.is_password_changed) {
        global.navigate(global.keys.SETUP_2FA, {}, { email: preLogin.email });
      } else if (!userInfo.is_password_changed || (userInfo.is_require_passwordless && userInfo.login_method === 'password')) {
        global.navigate(global.keys.AUTHENTICATE, {}, { email: userInfo.email })
      } else if (isUnlockByDesktop) {
        getServiceUser();
      }
    }
  }, [userInfo, isUnlockByDesktop])

  const initState = () => {
    setCallingAPI(false);
    setIsPair(false);
    setServiceUser(null);
    setStep(1);
    setOtherMethod('password')
  }

  const fetchData = async () => {
    setLoading(true);
    await common.fetchUserInfo();
    setLoading(false);
  }

  const handleLogout = async () => {
    setLogging(true);
    await authServices.logout(true);
    setLogging(false);
  }

  const getServiceUser = async () => {
    setLoading(true);
    setIsPair(isDesktopConnected && !service.pairingService?.hasKey)
    if (service.pairingService?.hasKey) {
      try {
        const serviceUser = await service.getCurrentUser();
        if (serviceUser) {
          setOtherMethod(cacheData?.unlock_method || null);
          setServiceUser(serviceUser);
        } else {
          setStep(1)
        }
      } catch (error) {
        await commonServices.reset_service();
        setStep(1)
      }
    } else {
      setStep(1)
    }
    setLoading(false)
  }

  const handleSubmit = async (values) => {
    setCallingAPI(true);
    const payload = {
      ...values,
      keyB64: values.key,
      email: userInfo.email,
      username: userInfo.email,
      sync_all_platforms: userInfo.sync_all_platforms,
      unlock_method: values.unlock_method || otherMethod
    }
    await common.unlockToVault(payload, query, () => {
      const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
      navigate(returnUrl);
    })
    setCallingAPI(false)
  }

  return (
    <Spin spinning={isLoading || loading}>
      <div
        className="auth-page"
      >
        <AuthCard
          className="w-[600px]"
        >
          <LockForm
            step={step}
            isPair={isPair}
            logging={logging}
            loading={loading}
            callingAPI={callingAPI}
            serviceUser={serviceUser}
            otherMethod={otherMethod}
            isUnlockByDesktop={isUnlockByDesktop}
            setStep={setStep}
            setIsPair={setIsPair}
            setServiceUser={setServiceUser}
            setOtherMethod={setOtherMethod}
            onSubmit={handleSubmit}
            onLogout={handleLogout}
          />
        </AuthCard>
      </div>
    </Spin>
  );
}

export default Lock;