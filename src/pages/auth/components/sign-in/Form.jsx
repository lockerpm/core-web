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
import { PairingForm, PasswordlessForm } from "../../../../components";

const SignInForm = (props) => {
  const {
    loading,
    onSubmit = () => {}
  } = props;
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale);
  const isDesktop = useSelector((state) => state.system.isDesktop)

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

  const handleSubmit = (values) => {
    if (preLogin) {
      onSubmit(values)
    } else {
      handlePrelogin(values)
    }
  }

  const handlePrelogin = async (values) => {
    setCallingAPI(true)
    await userServices.users_prelogin({ email: values.username }).then((response) => {
      // check password less
      setPreLogin(response)
      if (response.login_method === 'passwordless') {
        if (!isDesktop) {
          setIsPair(!service.pairingService.hasKey)
        }
      }
    }).catch((error) => {
      setPreLogin(null)
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  return (
    <div className="sign-in-form">
      <Form
        form={form}
        key={locale}
        onFinish={handleSubmit}
        disabled={loading || callingAPI}
      >
        {
          preLogin?.login_method !== 'passwordless' && <Form.Item
            name="username"
            rules={[
              global.rules.REQUIRED(t('auth_pages.username')),
              global.rules.INVALID(t('auth_pages.username'), 'EMAIL'),
            ]}
          >
            <Input
              placeholder={t('placeholder.username')}
              size="large"
              onChange={() => setPreLogin(null)}
            />
          </Form.Item>
        }
        {
          !preLogin && <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading || callingAPI}
          >
            {t('button.continue')}
          </Button>
        }
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
        {
          preLogin?.login_method === 'passwordless' && <div>
            {
              isPair ? <PairingForm
                isLogin={true}
                onConfirm={() => setIsPair(false)}
              /> : <PasswordlessForm
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
          </div>
        }
      </Form>
    </div>
  );
}

export default SignInForm;