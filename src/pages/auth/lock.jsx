import React, { useEffect, useState, useMemo } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button,
  Avatar,
  Row,
  Col,
  Spin
} from '@lockerpm/design';

import { PairingForm, PasswordlessForm } from "../../components";

import AuthLogo from '../../assets/images/logos/auth-logo.svg';
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import RULES from '../../config/rules'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import coreServices from "../../services/core";
import commonServices from "../../services/common";
import authServices from "../../services/auth";
import userServices from "../../services/user";

import storeActions from "../../store/actions";

import common from "../../utils/common";
import global from "../../config/global";

const Lock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isDesktop = useSelector((state) => state.system.isDesktop)
  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.system.isLoading);

  const [loading, setLoading] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [logging, setLogging] = useState(false);
  const [isPair, setIsPair] = useState(false)
  const [form] = Form.useForm();
  const [serviceUser, setServiceUser] = useState(false)

  const query = common.convertStringToQuery(window.location.search);

  useEffect(() => {
    commonServices.fetch_user_info();
  }, [])

  useEffect(() => {
    if (userInfo?.email) {
      getServiceUser();
    }
  }, [userInfo?.email])

  const description = useMemo(() => {
    if (userInfo?.sync_all_platforms) {
      return t('lock.cross_platform_sync_enable')
    }
    return userInfo?.login_method === 'passwordless' ? t('lock.connect_key') : t('lock.description')
  }, [userInfo])

  const handleUnlock = async () => {
    if (serviceUser) {
      await handleSubmit(serviceUser)
    } else {
      form.validateFields().then(async (values) => {
        await handleSubmit(values)
      })
    }
  }

  const handleSubmit = async (values) => {
    setCallingAPI(true)
    const payload = {
      ...values,
      keyB64: values.key,
      email: userInfo.email,
      username: userInfo.email
    }
    await userServices.users_session(payload).then(async (response) => {
      if (response.is_factor2) {
        global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
        global.navigate(global.keys.OTP_CODE, {}, {return_url: query?.return_url})
      } else {
        await coreServices.unlock({...response, ...payload })
        await commonServices.sync_data();
        const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
        navigate(returnUrl);
      }
    }).catch((error) => {
      global.pushError(error)
    });
    setCallingAPI(false)
  }

  const getServiceUser = async () => {
    setLoading(true);
    if (userInfo?.sync_all_platforms || userInfo.login_method === 'passwordless') {
      setIsPair(!isDesktop && !service.pairingService?.hasKey)
      if (userInfo.sync_all_platforms && (isDesktop || service.pairingService?.hasKey)) {
        try {
          const serviceUser = await service.getCurrentUser();
          if (serviceUser?.email === userInfo.email) {
            setServiceUser(serviceUser)
          }
        } catch (error) {
          commonServices.reset_service();
        }
      }
    } else {
      setIsPair(false)
    }
    setLoading(false)
  }

  const handlePairConfirm = async () => {
    setIsPair(false)
    if (userInfo?.sync_all_platforms) {
      try {
        const serviceUser = await service.getCurrentUser();
        if (serviceUser?.email === userInfo.email) {
          setServiceUser(serviceUser)
          await handleSubmit(serviceUser)
        }
      } catch (error) {
        commonServices.reset_service();
      }
    }
  }

  const handleLogout = async () => {
    setLogging(true);
    await authServices.logout();
    setLogging(false);
  }

  return (
    <Spin spinning={isLoading || loading}>
      <div
        className="lock-page"
      >
        <div
          className="w-[600px]"
          style={{
            backgroundImage: `url(${AuthBgImage})`,
            backgroundSize: 'contain',
            paddingTop: 62,
            height: 'max-content'
          }}
        >
          <div className="flex items-center justify-center mb-8">
            <Image
              className='icon-logo'
              src={AuthLogo}
              preview={false}
              height={48}
            />
          </div>
          <div className="flex items-center justify-center">
            <Card
              className="w-[430px]"
              bodyStyle={{
                padding: '32px'
              }}
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-2xl font-semibold">
                  { t('lock.title') }
                </p>
              </div>
              <p className="mb-6 mt-2">
                {description}
              </p>
              <Form
                form={form}
                key={locale}
              >
                <Form.Item>
                  <Input
                    placeholder={t('auth_pages.username')}
                    prefix={
                      <Avatar
                        src={userInfo?.avatar}
                      >
                        {userInfo?.email.slice(0, 1)?.toUpperCase()}
                      </Avatar>
                    }
                    value={userInfo?.name}
                    size="large"
                    readOnly={true}
                  />
                </Form.Item>
                <div>
                  {
                    isPair && <PairingForm
                      userInfo={userInfo}
                      callingAPI={callingAPI}
                      onConfirm={() => handlePairConfirm()}
                    />
                  }
                  {
                    userInfo?.login_method === 'passwordless' && !isPair && !serviceUser && <div>
                      <PasswordlessForm
                        changing={callingAPI}
                        isUnlock={true}
                        userInfo={userInfo}
                        onError={() => setIsPair(true)}
                        onConfirm={(password) => handleSubmit({
                          password
                        })}
                      />
                      {
                        !callingAPI && <Button
                          className="w-full mt-6"
                          size="large"
                          htmlType="submit"
                          loading={logging}
                          onClick={() => handleLogout()}
                        >
                          {t('sidebar.logout')}
                        </Button>
                      }
                    </div>
                  }
                  {
                    userInfo?.login_method === 'password' && !isPair && !serviceUser && <div className="mb-6">
                      <Form.Item
                        name="password"
                        noStyle
                        rules={[
                          RULES.REQUIRED(t('lock.password')),
                        ]}
                      >
                        <Input.Password
                          placeholder={t('lock.password')}
                          size="large"
                          disabled={callingAPI || logging}
                          onPressEnter={handleUnlock}
                        />
                      </Form.Item>
                    </div>
                  }
                  {
                    !isPair && (serviceUser || userInfo?.login_method === 'password') && <Row gutter={[8, 0]}>
                      <Col span={12}>
                        <Button
                          className="w-full"
                          size="large"
                          htmlType="submit"
                          disabled={callingAPI}
                          loading={logging}
                          onClick={() => handleLogout()}
                        >
                          {t('sidebar.logout')}
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          className="w-full"
                          size="large"
                          type="primary"
                          htmlType="submit"
                          disabled={logging}
                          loading={callingAPI}
                          onClick={handleUnlock}
                        >
                          {t('lock.unlock')}
                        </Button>
                      </Col>
                    </Row>
                  }
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default Lock;