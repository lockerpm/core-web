import React, { useEffect, useState } from "react";
import './css/auth.scss';

import { Image, Row, Col, Button, Input, Avatar, Form } from '@lockerpm/design';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ChangePasswordForm, PairingForm, PasswordlessForm } from "../../components";

import WelcomeImg from '../../assets/images/welcome.svg';
import userServices from "../../services/user";

import global from "../../config/global";
import common from "../../utils/common";

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

  const [form] = Form.useForm()

  useEffect(() => {
    if (currentPage.query?.email) {
      handlePrelogin();
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  }, [])

  const handlePrelogin = async () => {
    setLoading(true)
    await userServices.users_prelogin({ email: currentPage.query?.email }).then(async (response) => {
      setPreLogin(response)
      if (response.login_method === 'passwordless' || response?.require_passwordless) {
        setIsPair(!isConnected || (!isDesktop && !service.pairingService?.hasKey))
      } else {
        setIsPair(false)
      }
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
      password: values.current_password,
    }
    await userServices.users_session(payload).then(async () => {
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
    if (currentPage?.query?.token) {
      await userServices.reset_password({
        email: preLogin.email,
        new_password: data.new_password,
        token: currentPage?.query?.token
      })
    } else {
    }
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
                  src={WelcomeImg}
                />
                <p className="mt-3">
                  {t('auth_pages.authenticate.description')}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={11} md={24} xs={24}>
            <div className="pl-12">
              <Input
                className="mb-6"
                placeholder={t('auth_pages.username')}
                prefix={
                  <Avatar
                    src={preLogin?.avatar}
                  >
                    {preLogin?.email.slice(0, 1)?.toUpperCase()}
                  </Avatar>
                }
                value={preLogin?.name}
                size="large"
                readOnly={true}
              />
              <p className="text-3xl font-semibold mb-2">
                {t('auth_pages.authenticate.title')}
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
                      onConfirm={(password) => handleSave({
                        email: preLogin.email,
                        new_password: password
                      })}
                    />
                  }
                  {
                    !isPair && preLogin?.login_method === 'password' && <ChangePasswordForm
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