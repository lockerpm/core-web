import React, { useEffect, useState } from "react";

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
import userServices from "../../../../services/user";

import common from "../../../../utils/common";

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
  const [existed, setExisted] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkExist();
  }, [])

  const checkExist = async () => {
    setChecking(true)
    const response = await ssoConfigServices.check_exists();
    setExisted(response?.existed)
    if (response?.existed) {
      if (isDesktop) {
        setStep(0)
      } else {
        if (currentPage.query?.code) {
          getUserByCode(response.sso_configuration, currentPage.query?.code)
        } else {
          redirectToAuthSSO(response.sso_configuration)
        }
      }
    } else {
      setStep(1)
    }
    setChecking(false)
  }

  const redirectToAuthSSO = (ssoConfiguration) => {
    window.location.replace(ssoConfiguration.sso_provider_options.authorization_endpoint)
  }

  const getUserByCode = async (ssoConfiguration, code) => {
    setChecking(true)
    await ssoConfigServices.get_user_by_code({
      code: code,
      redirect_uri: ""
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      // redirectToAuthSSO(ssoConfiguration)
    });
    setChecking(false)
  }

  const handleSingleSignOn = () => {
    setStep(1)
  }

  return (
    <div>
      <Spin spinning={checking}>
        <div className="flex items-center justify-center">
          <Card
            className="w-[400px]"
            bodyStyle={{
              padding: '32px'
            }}
          >
            <div className="w-full flex items-center mb-6">
              {
                ((step > 0 && existed) || step > 1) && <Button
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
              step === 0 && <Button
                className="w-full"
                size="large"
                type="primary"
                loading={loading}
                onClick={handleSingleSignOn}
              >
                {t('auth_pages.sign_in.single_sign_on')}
              </Button>
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
          </Card>
        </div>
      </Spin>
    </div>
  );
}

export default Enterprise;