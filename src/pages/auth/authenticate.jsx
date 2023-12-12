import React, { useEffect, useState, useMemo } from "react";
import './css/auth.scss';

import { Image, Row, Col, Button, Input, Avatar, Form } from '@lockerpm/design';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ChangePasswordForm, PairingForm, PasswordlessForm } from "../../components";

import WelcomeImg from '../../assets/images/welcome.svg';

import userServices from "../../services/user";
import coreServices from "../../services/core";
import authServices from "../../services/auth";

import global from "../../config/global";
import common from "../../utils/common";
import jsCore from "../../core-js"

const Authenticate = () => {
  const { t } = useTranslation();
  const currentPage = common.getRouterByLocation(window.location)

  const isConnected = useSelector((state) => state.service.isConnected)
  const isDesktop = useSelector((state) => state.system.isDesktop)

  const [preLogin, setPreLogin] = useState(null)
  const [step, setStep] = useState(currentPage?.query?.token ? 1 : 0)
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [userSession, setUserSession] = useState(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (currentPage.query?.token) {
      getAccessTokenByToken();
    }
    if (currentPage.query?.email) {
      handlePrelogin();
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  }, [])

  useEffect(() => {
    if (preLogin?.login_method === 'passwordless' || preLogin?.require_passwordless) {
      setIsPair(!isConnected || (!isDesktop && !service.pairingService?.hasKey))
    } else {
      setIsPair(false)
    }
  }, [preLogin, isConnected, isDesktop])

  const title = useMemo(() => {
    if (preLogin?.login_method === 'password' && !preLogin?.require_passwordless) {
      return t('auth_pages.authenticate.title');
    }
    return t('auth_pages.authenticate.setup_pwl');
  }, [preLogin])

  const description = useMemo(() => {
    if (preLogin?.login_method === 'password' && !preLogin?.require_passwordless) {
      return t('auth_pages.authenticate.description');
    }
    return t('auth_pages.authenticate.setup_pwl_description')
  }, [preLogin])

  const getAccessTokenByToken = async () => {
    global.jsCore = await jsCore();
    await userServices.users_access_token(currentPage.query?.token).then((response) => {
      setUserSession(response);
    }).catch((error) => {
      setUserSession(null)
      global.pushError(error);
    })
  }

  const handlePrelogin = async () => {
    setLoading(true)
    await userServices.users_prelogin({ email: currentPage.query?.email }).then(async (response) => {
      setPreLogin(response)
    }).catch((error) => {
      setIsPair(false)
      setPreLogin(null)
      global.pushError(error)
    })
    setLoading(false)
  }

  const handleFirstSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      email: currentPage.query?.email,
      username: currentPage.query?.email,
      password: values.current_password,
    }
    await userServices.users_session(payload).then(async (response) => {
      setUserSession({ ...payload, ...response });
      setCurrentPassword(values.current_password)
      setStep(1)
    }).catch((error) => {
      setCurrentPassword(null)
      setStep(0)
      global.pushError(error)
    }).finally(() => {
      setCallingAPI(false)
    });
  }

  const handleSave = async (data) => {
    setCallingAPI(true);
    try {
      if (currentPage?.query?.token) {
        await userServices.reset_password({
          username: preLogin.email,
          new_password: data.new_password,
          token: currentPage?.query?.token
        })
        global.navigate(global.keys.SIGN_IN, {}, { email: preLogin.email })
      } else {
        authServices.update_access_token_type(userSession.token_type)
        authServices.update_access_token(userSession.access_token);
        await coreServices.unlock(userSession);
        await userServices.change_password({
          username: preLogin.email,
          password: currentPassword,
          new_password: data.new_password,
          login_method: preLogin?.require_passwordless ? 'passwordless' : preLogin.login_method
        })

        authServices.logout({ email: preLogin.email });
      }
      global.pushSuccess(t('notification.success.change_password.changed'))
    } catch (error) {
      setStep(0)
      global.pushError(error)
    }
    setUserSession(null)
    setCallingAPI(false);
  }

  return (
    <div className="welcome-page">
      <div className="welcome-page__bottom-left"></div>
      <div className="welcome-page__center w-full">
        <Row gutter={[24, 24]} type="flex" align={'middle'} justify={'space-between'}>
          <Col lg={12} md={24}>
            <div className="welcome-page__center--left mt-12 ml-12 h-[340px] flex items-center">
              <div className="w-full text-center px-12">
                <Image
                  className="mb-6"
                  src={WelcomeImg}
                />
                <div className="flex items-center justify-center">
                  <Avatar
                    src={preLogin?.avatar}
                  >
                    {preLogin?.email.slice(0, 1)?.toUpperCase()}
                  </Avatar>
                  <p className="ml-2 font-semibold">{preLogin?.email}</p>
                </div>
                <p className="mt-6">
                  {description}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={11} md={24} xs={24}>
            <div className="pl-12">
              <p className="text-3xl font-semibold mb-10">
                {title}
              </p>
              {
                step === 0 && <Form
                  form={form}
                  layout="vertical"
                  labelAlign={'left'}
                  disabled={callingAPI}
                  onFinish={handleFirstSignIn}
                >
                  <Form.Item
                    name={'current_password'}
                    label={t('change_password.current_password')}
                    rules={[
                      global.rules.REQUIRED(t("change_password.current_password")),
                    ]}
                  >
                    <Input.Password
                      size='large'
                      placeholder={t('placeholder.enter')}
                    />
                  </Form.Item>

                  <Button
                    className="mt-4 w-full"
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={callingAPI}
                  >
                    {t('button.continue')}
                  </Button>
                </Form>
              }
              {
                step === 1 && <div>
                  {
                    isPair && <PairingForm
                      userInfo={preLogin}
                      onConfirm={() => setIsPair(false)}
                    />
                  }
                  {
                    !isPair && (preLogin?.login_method === 'passwordless' || preLogin?.require_passwordless) && <PasswordlessForm
                      changing={callingAPI}
                      userInfo={preLogin}
                      accessToken={userSession?.access_token}
                      onRepair={() => setIsPair(true)}
                      onConfirm={(password) => handleSave({ new_password: password })}
                    />
                  }
                  {
                    !isPair && (preLogin?.login_method === 'password' && !preLogin?.require_passwordless) && <ChangePasswordForm
                      changing={callingAPI}
                      showPwh={false}
                      onSave={handleSave}
                    />
                  }
                </div>
              }

              <div className="mt-4 text-center">
                <span>
                  {t('auth_pages.authenticate.note')}
                  <Button
                    type="link"
                    className="font-semibold"
                    onClick={() => global.navigate(global.keys.SIGN_IN)}
                  >
                    {t('auth_pages.sign_in.label')}
                  </Button>
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="welcome-page__top-right"></div>
    </div>

  );
}

export default Authenticate;