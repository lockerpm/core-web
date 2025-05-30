import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import {
  Image,
  Row,
  Col,
  Button,
  Input,
  Avatar,
  Form
} from '@lockerpm/design';

import {
  KeyOutlined,
  UsbOutlined
} from "@ant-design/icons";

import formsComponents from "../../components/forms";
import authComponents from "./components";

import images from "../../assets/images";

import userServices from "../../services/user";
import authServices from "../../services/auth";

import global from "../../config/global";
import common from "../../utils/common";

const Setup2FA = () => {
  const { Pairing, SecurityKey, Passkey } = formsComponents;
  const { Enable2FA } = authComponents;
  
  const { WelcomeImg } = images;
  const { t } = useTranslation();
  const location = useLocation();
  const currentPage = common.getRouterByLocation(location)
  const isConnected = useSelector((state) => state.service.isConnected)

  const [preLogin, setPreLogin] = useState(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [factor2, setFactor2] = useState(null)
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)
  const [otherMethod, setOtherMethod] = useState('')
  const [currentPassword, setCurrentPassword] = useState(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (currentPage?.query?.email) {
      handlePrelogin();
    } else {
      global.navigate(global.keys.SIGN_IN)
    }
  }, [])

  useEffect(() => {
    if (step === 0) {
      setIsPair(false);
      setCallingAPI(false);
      setFactor2(null)
    }
  }, [step])

  useEffect(() => {
    if (preLogin) {
      if (!preLogin?.is_password_changed) {
        global.navigate(global.keys.AUTHENTICATE, {}, { email: preLogin.email });
      } else if (preLogin?.is_factor2 || !preLogin?.require_2fa) {
        if (preLogin?.require_passwordless && preLogin?.login_method === 'password') {
          global.navigate(global.keys.AUTHENTICATE, {}, { email: preLogin.email });
          return;
        }
        global.navigate(global.keys.SIGN_IN)
      }
    }
  }, [preLogin])

  const handlePrelogin = async () => {
    setLoading(true)
    await userServices.users_prelogin({ email: currentPage.query?.email }).then(async (response) => {
      setPreLogin(response)
    }).catch((error) => {
      global.navigate(global.keys.SIGN_IN, {}, { email: currentPage.query?.email })
    })
    setLoading(false)
  }

  const handleSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      email: preLogin?.email,
      username: preLogin?.email,
      password: values.current_password,
    }
    await userServices.users_session(payload).then(async (response) => {
      setFactor2(response);
      setStep(2);
      setCurrentPassword(values.current_password);
    }).catch((error) => {
      setFactor2(null)
      setStep(0)
      setCurrentPassword(null);
      global.pushError(error)
    }).finally(() => {
      setCallingAPI(false)
    });
  }

  const enabled2FA = async (payload) => {
    setCallingAPI(true);
    await authServices.update_factor2(payload).then(async () => {
      global.pushSuccess(t('notification.success.factor2.enabled'));
      if (preLogin?.require_passwordless && preLogin?.login_method === 'password') {
        global.navigate(global.keys.AUTHENTICATE, {}, { email: preLogin.email });
      } else {
        await common.unlockToVault({
          password: currentPassword,
          username: preLogin.email,
          email: preLogin.email,
          sync_all_platforms: preLogin.sync_all_platforms,
          unlock_method: otherMethod
        })
      }
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  const selectOtherMethod = (method) => {
    setOtherMethod(method);
    if (method === 'security_key') {
      setIsPair(!isConnected || !service.pairingService?.hasKey);
    } else {
      setIsPair(false)
    }
    setStep(1);
  }

  const signOtherAccount = () => {
    common.updateSsoAccount(null);
    global.navigate(global.keys.SIGN_IN)
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
                  {t('auth_pages.setup_2fa.description')}
                </p>
              </div>
            </div>
          </Col>
          <Col lg={11} md={24} xs={24}>
            <div className="pl-12">
              <p className="text-3xl font-semibold mb-10">
                {t('auth_pages.setup_2fa.title')}
              </p>
              {
                step === 0 && <div>
                  {
                    preLogin?.login_method === 'password' && <Form
                      form={form}
                      layout="vertical"
                      labelAlign={'left'}
                      disabled={callingAPI}
                      onFinish={handleSignIn}
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
                    preLogin?.login_method !== 'password' && <div>
                      <p className="mb-2 font-semibold">
                        {t('change_password.current_password')}
                      </p>
                      <Button
                        className="w-full mb-4"
                        size="large"
                        ghost
                        type="primary"
                        icon={<KeyOutlined />}
                        disabled={loading || callingAPI}
                        onClick={() => selectOtherMethod('passkey')}
                      >
                        {t('auth_pages.sign_in.your_passkey')}
                      </Button>
                      <Button
                        className="w-full"
                        size="large"
                        ghost
                        type="primary"
                        icon={<UsbOutlined />}
                        disabled={loading || callingAPI}
                        onClick={() =>selectOtherMethod('security_key')}
                      >
                        {t('auth_pages.sign_in.your_security_key')}
                      </Button>
                    </div>
                  }
                </div>
              }
              {
                step === 1 && <div>
                  {
                    isPair && <Pairing
                      userInfo={preLogin}
                      onConfirm={() => setIsPair(false)}
                    />
                  }
                  {
                    !isPair && otherMethod === 'security_key' && <SecurityKey
                      changing={callingAPI}
                      userInfo={preLogin}
                      onRepair={() => setIsPair(true)}
                      onConfirm={(password) => handleSignIn({ current_password: password })}
                    />
                  }
                  {
                    !isPair && otherMethod === 'passkey' && <Passkey
                      changing={loading}
                      userInfo={preLogin}
                      onConfirm={(password) => handleSignIn({ current_password: password })}
                    />
                  }
                </div>
              }
              {
                step === 2 && <Enable2FA
                  factor2={factor2}
                  callingAPI={callingAPI}
                  setCallingAPI={setCallingAPI}
                  onEnable={enabled2FA}
                  onBack={() => setStep(1)}
                />
              }
            </div>
            <div className="mt-4 text-center">
              <span>
                {t('auth_pages.authenticate.note')}
                <Button
                  type="link"
                  className="font-semibold"
                  onClick={() => signOtherAccount()}
                >
                  {t('auth_pages.sign_in.label')}
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div className="welcome-page__top-right"></div>
    </div>
  );
}

export default Setup2FA;