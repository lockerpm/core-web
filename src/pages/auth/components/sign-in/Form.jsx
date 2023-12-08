import React, { useEffect, useState } from "react";

import {
  Input,
  Form,
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../config/global";

import userServices from "../../../../services/user";
import commonServices from "../../../../services/common";
import { PairingForm, PasswordlessForm } from "../../../../components";

const SignInForm = (props) => {
  const {
    loading,
    step = 1,
    onSubmit = () => { },
    setStep = () => { }
  } = props;
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const isDesktop = useSelector((state) => state.system.isDesktop);
  const isConnected = useSelector((state) => state.service.isConnected);

  const [preLogin, setPreLogin] = useState(null)
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      username: null,
      password: null
    })
  }, [])

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
      if (response.sync_all_platforms || response.login_method === 'passwordless') {
        setIsPair((response?.login_method === 'passwordless' || isConnected) && !isDesktop && !service.pairingService?.hasKey)
        if (isConnected && response.sync_all_platforms && (isDesktop || service.pairingService?.hasKey)) {
          try {
            const serviceUser = await service.getCurrentUser();
            if (serviceUser?.email === response.email) {
              await onSubmit({
                username: serviceUser?.email,
                hashedPassword: serviceUser?.hashedPassword,
                keyB64: serviceUser?.key
              })
            } else {
              setStep(2)
            }
          } catch (error) {
            console.log(error);
            setStep(2)
          }
        } else {
          setStep(2)
        }
      } else {
        setStep(2)
      }
    }).catch((error) => {
      setPreLogin(null)
      global.pushError(error)
    })
    setCallingAPI(false)
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
          step === 2 && <div>
            {
              isPair && <PairingForm
                userInfo={preLogin}
                isLogin={true}
                onConfirm={() => handlePairConfirm()}
              />
            }
            {
              !isPair && preLogin.login_method === 'passwordless' && <PasswordlessForm
                changing={loading}
                isLogin={true}
                userInfo={preLogin}
                onError={() => setIsPair(true)}
                onConfirm={(password) => handleSubmit({
                  username: preLogin.email,
                  password
                })}
              />
            }
            {
              !isPair && preLogin?.login_method === 'password' && <div>
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
          </div>
        }
      </Form>
    </div>
  );
}

export default SignInForm;