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
  const isDesktop = useSelector((state) => state.system.isDesktop)
  const currentPage = common.getRouterByLocation(location);

  const [step, setStep] = useState(0);
  const [ssoConfig, setSsoConfig] = useState(null);
  const [existed, setExisted] = useState(false);
  const [checking, setChecking] = useState(false);

  const ssoAccount = authServices.sso_account();

  useEffect(() => {
    checkExist();
  }, [])

  const checkExist = async () => {
    setChecking(true)
    const response = await ssoConfigServices.check_exists();
    setExisted(response?.existed)
    if (response?.existed) {
      setSsoConfig(response.sso_configuration)
      if (isDesktop) {
        setStep(0)
        setChecking(false)
      } else {
        if (ssoAccount?.email) {
          setStep(1)
          setChecking(false)
        } else if (currentPage.query?.code) {
          getUserByCode(response.sso_configuration, currentPage.query?.code)
        } else {
          setChecking(false)
          redirectToAuthSSO(response.sso_configuration)
        }
      }
    } else {
      setSsoConfig(null)
      setStep(1)
      setChecking(false)
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
      setStep(1);
      authServices.update_sso_account({ email: response.mail })
    }).catch((error) => {
      authServices.update_sso_account(null)
      global.pushError(error)
      redirectToAuthSSO(ssoConfiguration)
    });
    setChecking(false)
  }

  const handleSingleSignOn = () => {
    redirectToAuthSSO(ssoConfig)
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
                  onClick={handleSingleSignOn}
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
                  onClick={() => {
                    authServices.update_sso_account(null);
                    handleSingleSignOn();
                  }}
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