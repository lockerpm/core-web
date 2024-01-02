import React, { useEffect, useState } from "react";

import {
  Input,
  Form,
  Button,
} from '@lockerpm/design';

import {
  UserOutlined,
  KeyOutlined,
  UsbOutlined
} from '@ant-design/icons'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { PairingForm, PasswordlessForm, PasskeyForm } from "../../../../components";

import userServices from "../../../../services/user";
import commonServices from "../../../../services/common";
import authServices from "../../../../services/auth";

import global from "../../../../config/global";
import common from "../../../../utils/common";

const SignInForm = (props) => {
  const {
    loading,
    step = 1,
    onSubmit = () => { },
    setStep = () => { }
  } = props;
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);

  const locale = useSelector((state) => state.system.locale);
  const isDesktop = useSelector((state) => state.system.isDesktop);
  const isConnected = useSelector((state) => state.service.isConnected);

  const ssoAccount = authServices.sso_account();
  const email = ssoAccount?.email;

  const [preLogin, setPreLogin] = useState(null)
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)
  const [otherMethod, setOtherMethod] = useState('')

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      username: email || currentPage?.query?.email,
      password: null
    })
    if (email || currentPage?.query?.email) {
      handlePrelogin({ username: email || currentPage?.query?.email });
    }
  }, [])

  useEffect(() => {
    if (preLogin) {
      handleCheckPwl();
    }
  }, [preLogin, isConnected]);

  useEffect(() => {
    if (step === 2 && preLogin?.require_passwordless && isDesktop) {
      selectOtherMethod('security_key');
    }
  }, [preLogin, isDesktop, step]);

  useEffect(() => {
    if (step === 1) {
      setPreLogin(null);
      setCallingAPI(false);
      setIsPair(false)
      form.setFieldsValue({
        password: null
      })
    }
  }, [step])

  const handleSubmit = (values) => {
    if (preLogin) {
      onSubmit({
        ...values,
        sync_all_platforms: preLogin.sync_all_platforms
      })
    } else {
      handlePrelogin(values)
    }
  }

  const handlePrelogin = async (values) => {
    setCallingAPI(true)
    await userServices.users_prelogin({ email: values.username }).then(async (response) => {
      setPreLogin(response)
    }).catch((error) => {
      setPreLogin(null)
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  const handleCheckPwl = async () => {
    if (!preLogin.is_factor2 && preLogin.require_2fa) {
      global.navigate(global.keys.SETUP_2FA, {}, { email: preLogin.email })
    } else if (!preLogin.is_password_changed || (preLogin.login_method === 'password' && preLogin.require_passwordless)) {
      global.navigate(global.keys.AUTHENTICATE, {}, { email: preLogin.email })
    } else if (preLogin.sync_all_platforms) {
      setIsPair(isConnected && !isDesktop && !service.pairingService?.hasKey)
      if (isConnected && (isDesktop || service.pairingService?.hasKey)) {
        try {
          const serviceUser = await service.getCurrentUser();
          if (serviceUser?.email === preLogin.email) {
            await onSubmit({
              username: serviceUser?.email,
              hashedPassword: serviceUser?.hashedPassword,
              keyB64: serviceUser?.key
            })
          } else {
            setStep(2)
          }
        } catch (error) {
          setStep(2)
        }
      } else {
        setStep(2)
      }
    } else {
      setStep(2)
    }
  }

  const handlePairConfirm = async () => {
    setIsPair(false)
    if (preLogin?.sync_all_platforms) {
      try {
        const serviceUser = await service.getCurrentUser();
        if (serviceUser?.email === preLogin.email) {
          await onSubmit({
            username: serviceUser?.email,
            hashedPassword: serviceUser?.hashedPassword,
            keyB64: serviceUser?.key
          })
        }
      } catch (error) {
        await commonServices.reset_service();
      }
    }
  }

  const selectOtherMethod = (method) => {
    setStep(3);
    setOtherMethod(method);
    if (method === 'security_key' && !isDesktop) {
      setIsPair(isConnected && !service.pairingService?.hasKey);
    } else {
      setIsPair(false)
    }
  }

  return (
    <div className="sign-in-form">
      <Form
        form={form}
        key={locale}
        onFinish={handleSubmit}
        disabled={loading || callingAPI}
      >
        <div>
          <Form.Item
            name="username"
            rules={[
              global.rules.REQUIRED(t('auth_pages.username')),
              global.rules.INVALID(t('auth_pages.username'), 'EMAIL'),
            ]}
          >
            <Input
              placeholder={t('placeholder.username')}
              size="large"
              readOnly={email}
              prefix={email ? <UserOutlined /> : <></>}
              onChange={() => setStep(1)}
            />
          </Form.Item>
          {
            step === 1 && <Button
              className="w-full"
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading || callingAPI}
            >
              {t('button.continue')}
            </Button>
          }
        </div>
        {
          isPair && <PairingForm
            userInfo={preLogin}
            isLogin={true}
            onConfirm={() => handlePairConfirm()}
          />
        }
        {
          step === 2 && !isPair && <div>
            {
              !preLogin?.require_passwordless && <div>
                <Form.Item
                  name="password"
                  rules={[
                    global.rules.REQUIRED(t('auth_pages.password')),
                  ]}
                >
                  <Input.Password
                    placeholder={t('auth_pages.password')}
                    size="large"
                  />
                </Form.Item>
                <Button
                  className="w-full"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={loading || callingAPI}
                >
                  {t('button.sign_in')}
                </Button>
              </div>
            }
            {
              (!preLogin?.require_passwordless || !isDesktop) && <div>
                {
                  !preLogin?.require_passwordless && <p className="my-4 text-center">
                    {t('auth_pages.sign_in.or_login_with')}
                  </p>
                }
                {
                  !isDesktop && <Button
                    className="w-full mb-4"
                    size="large"
                    ghost
                    type="primary"
                    icon={<KeyOutlined />}
                    disabled={loading || callingAPI}
                    onClick={() => {
                      selectOtherMethod('passkey');
                    }}
                  >
                    {t('auth_pages.sign_in.your_passkey')}
                  </Button>
                }
                <Button
                  className="w-full"
                  size="large"
                  ghost
                  type="primary"
                  icon={<UsbOutlined />}
                  disabled={loading || callingAPI}
                  onClick={() => {
                    selectOtherMethod('security_key');
                  }}
                >
                  {t('auth_pages.sign_in.your_security_key')}
                </Button>
              </div>
            }
          </div>
        }
        {
          step === 3 && !isPair && <div>
            {
              otherMethod === 'security_key' && <PasswordlessForm
                changing={loading}
                isLogin={true}
                userInfo={preLogin}
                onRepair={() => setIsPair(true)}
                onConfirm={(password) => handleSubmit({
                  username: preLogin.email,
                  password
                })}
              />
            }
            {
              otherMethod === 'passkey' && <PasskeyForm
                changing={loading}
                isLogin={true}
                userInfo={preLogin}
                onConfirm={(password) => handleSubmit({
                  username: preLogin.email,
                  password
                })}
              />
            }
          </div>
        }
      </Form>
    </div>
  );
}

export default SignInForm;