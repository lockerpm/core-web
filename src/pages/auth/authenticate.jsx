import React, { useEffect, useState, useMemo } from "react";
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
  ArrowLeftOutlined,
  KeyOutlined,
  UsbOutlined
} from '@ant-design/icons'

import formsComponents from "../../components/forms";
import authComponents from "./components";

import images from "../../assets/images";

import userServices from "../../services/user";
import coreServices from "../../services/core";

import global from "../../config/global";
import common from "../../utils/common";

const Authenticate = () => {
  const { ChangePassword, Pairing, SecurityKey } = formsComponents;
  const { EnterOtp } = authComponents;

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
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newFullName, setNewFullName] = useState(null)
  const [userSession, setUserSession] = useState(null)
  const [otherMethod, setOtherMethod] = useState('')

  const [form] = Form.useForm()

  useEffect(() => {
    if (global.jsCore) {
      if (currentPage?.query?.email) {
        handlePrelogin();
        if (currentPage?.query?.token) {
          getAccessTokenByToken();
        }
      } else {
        global.navigate(global.keys.SIGN_IN)
      }
    }
  }, [global.jsCore])

  useEffect(() => {
    if (preLogin) {
      if (!preLogin?.is_factor2 && preLogin?.require_2fa && preLogin?.is_password_changed) {
        global.navigate(global.keys.SETUP_2FA, {}, { email: preLogin.email });
        return;
      }
      if (preLogin?.is_password_changed && !(preLogin?.require_passwordless && preLogin?.login_method === 'password')) {
        global.navigate(global.keys.SIGN_IN, {}, { email: preLogin.email });
        return;
      }
      if (currentPage?.query?.token) {
        if (preLogin?.is_password_changed) {
          setStep(2)
        } else {
          setStep(1)
        }
      } else {
        setStep(0)
      }
    }
  }, [preLogin])

  useEffect(() => {
    if (step === 1) {
      setOtherMethod('');
      form.setFieldValue('passkeyName', null)
    }
  }, [step, isConnected, preLogin])

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
      global.navigate(global.keys.SIGN_IN, {}, { email: currentPage.query?.email })
    })
    setLoading(false)
  }

  const selectOtherMethod = (method) => {
    setOtherMethod(method);
    setStep(3);
    if (method === 'security_key') {
      setIsPair(!isConnected || !service.pairingService?.hasKey);
    } else {
      setIsPair(false)
    }
  }

  const handleFirstSignIn = async (values) => {
    setCallingAPI(true)
    const payload = {
      email: currentPage.query?.email,
      username: currentPage.query?.email,
      password: values.current_password,
    }
    await userServices.users_session(payload).then(async (response) => {
      if (response.is_factor2) {
        setFactor2(response)
        setCurrentPassword(values.current_password);
      } else {
        setFactor2(null)
        setUserSession({
          ...payload,
          ...response,
          access_token: response.access_token || response.token,
        });
        setCurrentPassword(values.current_password);
        if (preLogin?.is_password_changed) {
          setStep(2)
        } else {
          setStep(1)
        }
      }
    }).catch((error) => {
      setFactor2(null)
      setCurrentPassword(null)
      setStep(0)
      global.pushError(error)
    }).finally(() => {
      setCallingAPI(false)
    });
  }

  const onVerify = async (payload) => {
    setCallingAPI(true)
    await userServices.users_session_otp({
      ...payload,
      email: preLogin?.email,
      password: currentPassword,
    }).then(async (response) => {
      setUserSession({ ...payload, ...response });
      if (preLogin?.is_password_changed) {
        setStep(2)
      } else {
        setStep(1)
      }
      setFactor2(null)
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false)
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
        await common.updateAccessTokenType(userSession.token_type)
        await common.updateAccessToken(userSession.access_token);
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
      sync_all_platforms: preLogin.sync_all_platforms,
      unlock_method: otherMethod
    }
    await common.unlockToVault(payload)
  }

  const setPasswordLessByPasskey = async (values) => {
    try {
      setCallingAPI(true);
      await service.setApiToken(userSession?.access_token);
      const response = await service.setNewPasswordlessUsingPasskey({
        email: preLogin.email,
        name: newFullName || preLogin.name,
        passkeyName: values.passkeyName,
      })
      handleSave({
        new_password: response
      })
    } catch (error) {
      global.pushError(error)
      setCallingAPI(false);
    }
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
                  src={images.WelcomeImg}
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
              <div className="w-full flex items-center mb-10">
                {
                  step > 1 && <Button
                    className="mr-2"
                    type={'text'}
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      if (step === 2 && preLogin.is_password_changed) {
                        setStep(0)
                      } else {
                        setStep(step -1 )
                      }
                    }}
                  />
                }
                <p className="text-3xl font-semibold">
                  {title}
                </p>
              </div>
              {
                step === 0 && <div>
                  {
                    !!factor2 && <EnterOtp
                      callingAPI={callingAPI}
                      factor2={factor2}
                      isAuth={true}
                      onVerify={onVerify}
                      onBack={() => setFactor2(null)}
                    />
                  }
                  {
                    !factor2 && <Form
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
                </div>
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
                    !preLogin?.require_passwordless && <ChangePassword
                      changing={callingAPI}
                      onSave={handleSave}
                    />
                  }
                  {
                    preLogin?.require_passwordless && <div>
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
                        onClick={() => selectOtherMethod('security_key')}
                      >
                        {t('auth_pages.sign_in.your_security_key')}
                      </Button>
                    </div>
                  }
                </div>
              }
              {
                step === 3 && <div>
                  {
                    otherMethod === 'security_key' && <div>
                      {
                        isPair && <Pairing
                          userInfo={preLogin}
                          onConfirm={() => setIsPair(false)}
                        />
                      }
                      {
                        !isPair && preLogin?.require_passwordless && <SecurityKey
                          changing={callingAPI}
                          userInfo={preLogin}
                          accessToken={userSession?.access_token}
                          onRepair={() => setIsPair(true)}
                          onConfirm={(password) => handleSave({ new_password: password })}
                        />
                      }
                    </div>
                  }
                  {
                    otherMethod === 'passkey' && <div>
                      <Form
                        form={form}
                        layout="vertical"
                        disabled={callingAPI}
                        onFinish={setPasswordLessByPasskey}
                      >
                        <Form.Item
                          name={'passkeyName'}
                          label={t('security.passkey.add_new_key_description')}
                          rules={[
                            global.rules.REQUIRED(t('common.name')),
                          ]}
                        >
                          <Input
                            size="large"
                            autoFocus={true}
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
                    </div>
                  }
                </div>
              }
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
            </div>
          </Col>
        </Row>
      </div>
      <div className="welcome-page__top-right"></div>
    </div>
  );
}

export default Authenticate;