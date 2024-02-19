import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

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

import formsComponents from "../../../../components/forms";

import userServices from "../../../../services/user";
import commonServices from "../../../../services/common";
import authServices from "../../../../services/auth";

import global from "../../../../config/global";
import common from "../../../../utils/common";

const SignInForm = (props) => {
  const { Pairing, SecurityKey, Passkey } = formsComponents;
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
    if (step === 1) {
      setPreLogin(null);
      setCallingAPI(false);
      setIsPair(false)
      form.setFieldsValue({
        password: null
      })
    } else if (step === 2) {
      setIsPair(false)
    }
  }, [step, isPair])

  const handleSubmit = (values) => {
    if (preLogin) {
      onSubmit({
        ...values,
        sync_all_platforms: preLogin.sync_all_platforms,
        unlock_method: values.unlock_method || otherMethod
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
    if (!preLogin.is_factor2 && preLogin.require_2fa && preLogin.is_password_changed) {
      global.navigate(global.keys.SETUP_2FA, {}, { email: preLogin.email })
    } else if (!preLogin.is_password_changed || (preLogin.login_method === 'password' && preLogin.require_passwordless)) {
      global.navigate(global.keys.AUTHENTICATE, {}, { email: preLogin.email })
    } else if (preLogin.sync_all_platforms) {
      setIsPair(isConnected && !service.pairingService?.hasKey)
      if (isConnected && service.pairingService?.hasKey) {
        try {
          const serviceUser = await service.getCurrentUser();
          if (serviceUser?.email === preLogin.email) {
            const cacheData = await service.getCacheData();
            setOtherMethod(cacheData?.unlock_method || null);
            await onSubmit({
              username: serviceUser?.email,
              hashedPassword: serviceUser?.hashedPassword,
              keyB64: serviceUser?.key,
              unlock_method: cacheData?.unlock_method || null
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
          const cacheData = await service.getCacheData();
          setOtherMethod(cacheData?.unlock_method || null);
          await onSubmit({
            username: serviceUser?.email,
            hashedPassword: serviceUser?.hashedPassword,
            keyB64: serviceUser?.key,
            unlock_method: cacheData?.unlock_method || null
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
    if (method === 'security_key') {
      setIsPair(!isConnected || !service.pairingService?.hasKey);
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
          isPair && <Pairing
            userInfo={preLogin}
            isLogin={true}
            onConfirm={() => handlePairConfirm()}
          />
        }
        {
          !isPair && <div>
            {
              step === 2 && <div>
                {
                  preLogin?.login_method === 'password' && <div>
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
                <div>
                  {
                    preLogin?.login_method === 'password' && <p className="my-4 text-center">
                      {t('auth_pages.sign_in.or_login_with')}
                    </p>
                  }
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
              </div>
            }
            {
              step === 3 && <div>
                {
                  otherMethod === 'security_key' && <SecurityKey
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
                  otherMethod === 'passkey' && <Passkey
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
          </div>
        }
      </Form>
    </div>
  );
}

export default SignInForm;