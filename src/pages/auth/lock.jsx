import React, { useEffect, useState } from "react";
import './css/auth.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button,
  Avatar,
  Row,
  Col
} from '@lockerpm/design';

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

  const [callingAPI, setCallingAPI] = useState(false);
  const [logging, setLogging] = useState(false);
  const [form] = Form.useForm();

  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.system.isLoading);

  const query = common.convertStringToQuery(window.location.search);

  useEffect(() => {
    commonServices.fetch_user_info();
  }, [])

  const handleUnlock = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      await userServices.users_session({
        password: values.password,
        email: userInfo.email
      }).then(async (response) => {
        const returnUrl = query?.return_url ? decodeURIComponent(query?.return_url) : '/';
        if (response.is_factor2) {
          global.store.dispatch(storeActions.updateFactor2({
            ...response,
            email: userInfo.email,
            password: values.password,
          }));
          global.navigate(global.keys.OTP_CODE, {}, {return_url: returnUrl})
        } else {
          await coreServices.unlock({...response, password: values.password, username: userInfo.email })
          await commonServices.sync_data()
          navigate(returnUrl);
        }
      }).catch((error) => {
        global.pushError(error)
      });
      setCallingAPI(false)
    })
  }

  const handleLogout = async () => {
    setLogging(true);
    await authServices.logout();
    setLogging(false);
  }

  return (
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
            loading={isLoading}
            bodyStyle={{
              padding: '32px'
            }}
          >
            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-semibold">
                { t('lock.title') }
              </p>
            </div>
            <p className="mb-6 mt-2">{t('lock.description')}</p>
            <Form
              form={form}
              key={locale}
            >
              <div className="mb-4">
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
              </div>
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
            </Form>
            <Row gutter={[8, 0]}>
              <Col span={12}>
                <Button
                  className="w-full mt-6"
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
                  className="w-full mt-6"
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
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Lock;