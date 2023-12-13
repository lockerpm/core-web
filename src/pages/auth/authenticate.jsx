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
import commonServices from "../../services/common";

import global from "../../config/global";
import common from "../../utils/common";
import jsCore from "../../core-js"

const Authenticate = () => {
  const { t } = useTranslation();
  const currentPage = common.getRouterByLocation(window.location)

  const isConnected = useSelector((state) => state.service.isConnected)
  const isDesktop = useSelector((state) => state.system.isDesktop)

  const [preLogin, setPreLogin] = useState(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newFullName, setNewFullName] = useState(null)
  const [userSession, setUserSession] = useState(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (currentPage?.query?.email) {
      handlePrelogin();
      if (currentPage?.query?.token) {
        getAccessTokenByToken();
      }
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  }, [])

  useEffect(() => {
    if (preLogin?.is_password_changed && !(preLogin?.require_passwordless && preLogin?.login_method === 'password')) {
      global.navigate(global.keys.SIGN_IN, {}, { email: preLogin.email });
      return;
    }
    if (currentPage?.query?.token) {
      if (preLogin?.is_password_changed || (preLogin?.login_method === 'password' && !preLogin?.require_passwordless)) {
        setStep(2)
      } else {
        setStep(1)
      }
    } else {
      setStep(0)
    }
  }, [preLogin])

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
    if ((preLogin?.login_method === 'password' && !preLogin?.require_passwordless) || step === 1) {
      return t('auth_pages.authenticate.description');
    }
    return t('auth_pages.authenticate.setup_pwl_description')
  }, [preLogin, step])

  const getAccessTokenByToken = async () => {
    global.jsCore = await jsCore();
    await userServices.users_access_token(currentPage.query?.token).then((response) => {
      setUserSession(response?.access_token);
    }).catch((error) => {
      setStep(0)
      global.notification('error', t('notification.error.title'), t('auth_pages.authenticate.link_invalid'))
      setUserSession(null);
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
      setCurrentPassword(values.current_password);
      if (preLogin?.is_password_changed || (preLogin?.login_method === 'password' && !preLogin?.require_passwordless)) {
        setStep(2)
      } else {
        setStep(1)
      }
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
          full_name: data.full_name || newFullName,
          new_password: data.new_password,
          token: currentPage?.query?.token,
          login_method: preLogin?.require_passwordless ? 'passwordless' : preLogin.login_method
        })
      } else {
        authServices.update_access_token_type(userSession.token_type)
        authServices.update_access_token(userSession.access_token);
        if (newFullName || data.full_name) {
          await userServices.update_users_me({
            email: preLogin?.email,
            full_name: newFullName || data.full_name,
          })
        }
        await coreServices.unlock(userSession);
        await userServices.change_password({
          username: preLogin.email,
          password: currentPassword,
          new_password: data.new_password,
          login_method: preLogin?.require_passwordless ? 'passwordless' : preLogin.login_method
        })
      }
      global.pushSuccess(t('notification.success.change_password.changed'));
      await handleSignIn(data.new_password)
    } catch (error) {
      setStep(0)
      global.pushError(error)
    }
    setCallingAPI(false);
  }

  const handleSignIn = async (newPassword) => {
    const payload = {
      password: newPassword,
      username: preLogin.email,
      email: preLogin.email,
      sync_all_platforms: preLogin.sync_all_platforms
    }
    await commonServices.unlock_to_vault(payload)
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
                step === 1 && <Form
                  form={form}
                  layout="vertical"
                  labelAlign={'left'}
                  disabled={callingAPI}
                  onFinish={(v) => {
                    setNewFullName(v.full_name);
                    setStep(2)
                  }}
                >
                  <Form.Item
                    name={'full_name'}
                    label={t('common.full_name')}
                    rules={[
                      global.rules.REQUIRED(t("common.full_name")),
                    ]}
                  >
                    <Input
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
                step === 2 && <div>
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
                      isChange={false}
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