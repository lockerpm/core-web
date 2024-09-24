/* eslint-disable no-import-assign */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Form,
  Button,
  Spin
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import formsComponents from "../../components/forms";
import itemsComponents from "../../components/items";
import authComponents from "./components";
import lockComponents from "./components/lock";

import commonServices from "../../services/common";
import authServices from "../../services/auth";

import common from "../../utils/common";
import global from "../../config/global";

import './css/auth.scss';

const Lock = () => {
  const { t } = useTranslation();
  const { Pairing, SecurityKey, Passkey } = formsComponents;
  const { AuthCard } = authComponents;
  const { UserInfo  } = itemsComponents;
  const { UnlockTitle, MPForm, FormFooter, UnlockWith } = lockComponents;
  
  const navigate = useNavigate();
  const location = useLocation();

  const isConnected = useSelector((state) => state.service.isConnected)
  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.system.isLoading);

  const [loading, setLoading] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [logging, setLogging] = useState(false);
  const [isPair, setIsPair] = useState(false)
  const [form] = Form.useForm();
  const [serviceUser, setServiceUser] = useState(false)
  const [step, setStep] = useState(0);
  const [otherMethod, setOtherMethod] = useState(null)

  const query = common.convertStringToQuery(location.search);

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
      } else {
        getServiceUser();
      }
    }
  }, [userInfo?.email, isConnected])

  useEffect(() => {
    if (step === 1) {
      setIsPair(false)
    }
  }, [step, isPair])

  const showMpForm = useMemo(() => {
    return userInfo?.email && !userInfo?.is_require_passwordless
  }, [userInfo])

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
    await authServices.logout();
    setLogging(false);
  }

  const getServiceUser = async () => {
    setLoading(true);
    if (userInfo?.sync_all_platforms) {
      setIsPair(isConnected && !service.pairingService?.hasKey)
      if (isConnected && service.pairingService?.hasKey) {
        try {
          const serviceUser = await service.getCurrentUser();
          if (serviceUser?.email === userInfo.email) {
            const cacheData = await service.getCacheData();
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
    } else {
      setStep(1)
      setIsPair(false)
    }
    setLoading(false)
  }

  const selectOtherMethod = (method) => {
    setStep(2);
    setOtherMethod(method);
    if (method === 'security_key') {
      setIsPair(!isConnected || !service.pairingService?.hasKey);
    } else {
      setIsPair(false)
    }
  }

  const handleUnlock = async () => {
    if (serviceUser) {
      await handleSubmit(serviceUser)
    } else {
      form.validateFields().then(async (values) => {
        await handleSubmit(values)
      })
    }
  }

  const handlePairConfirm = async () => {
    setIsPair(false)
    if (userInfo?.sync_all_platforms) {
      try {
        const serviceUser = await service.getCurrentUser();
        if (serviceUser?.email === userInfo.email) {
          const cacheData = await service.getCacheData();
          setOtherMethod(cacheData?.unlock_method || null);
          setServiceUser(serviceUser)
          await handleSubmit({ ...serviceUser, unlock_method: cacheData?.unlock_method })
        }
      } catch (error) {
        await commonServices.reset_service();
      }
    }
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
          <>
            <UnlockTitle
              step={step}
              otherMethod={otherMethod}
              showMpForm={showMpForm}
              callingAPI={callingAPI}
              setStep={setStep}
              setIsPair={setIsPair}
              setOtherMethod={setOtherMethod}
            />
            <Form
              form={form}
              key={locale}
            >
              <div className="mt-6 mb-10 flex items-center justify-center">
                <UserInfo />
              </div>
              <div>
                {
                  isPair && <div>
                    <Pairing
                      userInfo={userInfo}
                      callingAPI={callingAPI}
                      onConfirm={() => handlePairConfirm()}
                    />
                    <Button
                      className="w-full mt-6"
                      size="large"
                      htmlType="submit"
                      loading={logging}
                      onClick={() => handleLogout()}
                    >
                      {t('sidebar.logout')}
                    </Button>
                  </div>
                }
                {
                  !isPair && <div>
                    {
                      !!serviceUser && <div>
                        <FormFooter
                          logging={logging}
                          callingAPI={callingAPI}
                          handleUnlock={handleUnlock}
                          handleLogout={handleLogout}
                        />
                      </div>
                    }
                    {
                      !serviceUser && <div>
                        {
                          step === 1 && <div>
                            {
                              userInfo?.login_method === 'password' && <div>
                                <MPForm
                                  logging={logging}
                                  callingAPI={callingAPI}
                                  handleUnlock={handleUnlock}
                                />
                               <FormFooter
                                  className="mt-6"
                                  logging={logging}
                                  callingAPI={callingAPI}
                                  handleUnlock={handleUnlock}
                                  handleLogout={handleLogout}
                                />
                                <p className="my-4 text-center">
                                  {t('auth_pages.sign_in.or_login_with')}
                                </p>
                              </div>
                            }
                            <UnlockWith
                              loading={loading}
                              userInfo={userInfo}
                              logging={logging}
                              callingAPI={callingAPI}
                              selectOtherMethod={selectOtherMethod}
                              handleLogout={handleLogout}
                            />
                          </div>
                        }
                        {
                          step === 2 && <div>
                            {
                              otherMethod === 'security_key' && <SecurityKey
                                changing={callingAPI}
                                userInfo={userInfo}
                                onRepair={() => setIsPair(true)}
                                onConfirm={(password) => handleSubmit({
                                  password
                                })}
                              />
                            }
                            {
                              otherMethod === 'passkey' && <Passkey
                                changing={loading}
                                userInfo={userInfo}
                                onConfirm={(password) => handleSubmit({
                                  password
                                })}
                              />
                            }
                            {
                              !callingAPI && <Button
                                className="w-full mt-6"
                                size="large"
                                htmlType="submit"
                                loading={logging}
                                onClick={() => handleLogout()}
                              >
                                {t('sidebar.logout')}
                              </Button>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </Form>
          </>
        </AuthCard>
      </div>
    </Spin>
  );
}

export default Lock;