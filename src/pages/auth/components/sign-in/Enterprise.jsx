import React, { useEffect, useState, useMemo } from "react";

import {
  Card,
  Button,
  Spin
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import SignInForm from "./Form";

import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import ssoConfigServices from "../../../../services/sso-config";
import authServices from "../../../../services/auth";

import common from "../../../../utils/common";
import global from "../../../../config/global";

const Enterprise = (props) => {
  const {
    loading,
    onSubmit = () => { }
  } = props;
  const location = useLocation()
  const { t } = useTranslation();
  const isDesktop = useSelector((state) => state.system.isDesktop);
  const isConnected = useSelector((state) => state.service.isConnected)
  const signInReload = useSelector((state) => state.auth.signInReload)

  const currentPage = common.getRouterByLocation(location);

  const clientId = ['desktop', 'browser'].includes(currentPage?.query?.client_id) ? currentPage?.query?.client_id : null

  const [step, setStep] = useState(0);
  const [ssoConfig, setSsoConfig] = useState(null);
  const [ssoUser, setSsoUser] = useState(null);
  const [existed, setExisted] = useState(false);
  const [checking, setChecking] = useState(false);

  const ssoAccount = authServices.sso_account();

  useEffect(() => {
    checkExist();
  }, [])

  useEffect(() => {
    if (ssoConfig) {
      checkSsoConfig();
    }
  }, [isConnected, isDesktop, ssoConfig, signInReload])

  useEffect(() => {
    if (ssoUser && !isDesktop) {
      openOtherClient();
    }
  }, [isConnected, ssoUser, isDesktop])

  const checkExist = async () => {
    setChecking(true)
    const response = await ssoConfigServices.check_exists();
    setExisted(response?.existed)
    if (response?.existed) {
      const ssoConfig = response.sso_configuration;
      setSsoConfig(ssoConfig)
      if (!isDesktop) {
        if (clientId) {
          authServices.update_sso_account(null);
          authServices.update_redirect_client_id(clientId);
          redirectToAuthSSO(ssoConfig);
        } else if (ssoAccount?.email) {
          setStep(1)
          setChecking(false)
        } else if (currentPage.query?.code) {
          getUserByCode(ssoConfig, currentPage.query?.code)
        } else {
          setChecking(false)
          setStep(1)
          redirectToAuthSSO(ssoConfig)
        }
      }
    } else {
      setSsoConfig(null)
      setStep(1)
      setChecking(false)
    }
  }

  const checkSsoConfig = async () => {
    if (isDesktop) {
      if (isConnected) {
        const cacheData = await service.getCacheData();
        if (cacheData) {
          authServices.update_sso_account({ email: cacheData.email })
          setStep(1);
        } else {
          setStep(0)
          setChecking(false)
        }
      } else {
        setStep(0)
        setChecking(false)
      }
    }
  }

  const openOtherClient = async () => {
    const redirectClientId = authServices.redirect_client_id();
    if (redirectClientId) {
      if (isConnected) {
        await service.setCacheData({ email: ssoUser.mail })
        if (redirectClientId === 'desktop') {
          await service.sendCustomMessage({ signInReload: true });
          window.location.replace(`locker-app://`);
        }
        authServices.update_redirect_client_id(null);
      } else if (redirectClientId === 'browser') {
        window.postMessage({
          command: 'cs-authResult',
          email: ssoUser.mail
        })
        authServices.update_redirect_client_id(null);
      }
    }
  }

  const isBack = useMemo(() => {
    if (ssoAccount) {
      return step > 2
    }
    if (existed && isDesktop) {
      return step > 0
    }
    return step > 1
  })

  const redirectToAuthSSO = (ssoConfiguration) => {
    if (ssoConfiguration.sso_provider_options.authorization_endpoint) {
      common.redirectToAuthSSO(ssoConfiguration.sso_provider_options)
    } else {
      setStep(1)
    }
  }

  const getUserByCode = async (ssoConfiguration, code) => {
    setChecking(true)
    await ssoConfigServices.get_user_by_code({
      code: code,
      redirect_uri: common.ssoRedirectUri()
    }).then((response) => {
      setSsoUser(response)
      authServices.update_sso_account({ email: response.mail })
      setStep(1);
    }).catch((error) => {
      setSsoUser(null);
      authServices.update_sso_account(null);
      global.pushError(error)
      redirectToAuthSSO(ssoConfiguration)
    });
    setChecking(false)
  }

  const signOtherAccount = () => {
    authServices.update_sso_account(null);
    if (isConnected) {
      service.setCacheData(null)
    }
    if (isDesktop) {
      setStep(0)
    } else {
      redirectToAuthSSO(ssoConfig)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <Card
          className="w-[400px]"
          bodyStyle={{
            padding: '32px'
          }}
        >
          <div className="w-full flex items-center mb-6">
            {
              isBack && <Button
                className="mr-2"
                type={'text'}
                icon={<ArrowLeftOutlined />}
                onClick={() => setStep(step - 1)}
              />
            }
            <p className="text-2xl font-semibold">
              {t('auth_pages.sign_in.title')}
            </p>
          </div>
          {
            step === 0 && <div>
              {
                !isDesktop && <div className="flex items-center justify-center">
                  <Spin spinning={checking} size="large"></Spin>
                </div>
              }
              {
                isDesktop && <Button
                  className="w-full"
                  size="large"
                  type="primary"
                  loading={loading || checking}
                  onClick={() => redirectToAuthSSO(ssoConfig)}
                >
                  {t('auth_pages.sign_in.single_sign_on')}
                </Button>
              }
            </div>
          }
          {
            step > 0 && <div>
              <SignInForm
                loading={loading}
                step={step}
                onSubmit={onSubmit}
                setStep={setStep}
              />
            </div>
          }
          {
            ssoAccount && <div className="mt-4 text-center">
              <span>
                {t('auth_pages.authenticate.note')}
                <Button
                  type="link"
                  className="font-semibold"
                  onClick={signOtherAccount}
                >
                  {t('auth_pages.sign_in.label')}
                </Button>
              </span>
            </div>
          }
        </Card>
      </div>
    </div>
  );
}

export default Enterprise;