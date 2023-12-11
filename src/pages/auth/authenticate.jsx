import React, { useEffect, useState } from "react";
import './css/auth.scss';

import { Image, Row, Col, Button, Input, Avatar } from '@lockerpm/design';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "../../components";

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
  const [callingAPI, setCallingAPI] = useState(false)
  const [isPair, setIsPair] = useState(false)

  useEffect(() => {
    if (currentPage.query?.email) {
      handlePrelogin();
    }
  }, [])

  const handleCancel = async () => {
    userServices.update_account_info(null)
    global.navigate('SIGN_IN', {}, {})
  }

  const handlePrelogin = async () => {
    setCallingAPI(true)
    await userServices.users_prelogin({ email: currentPage.query?.email }).then(async (response) => {
      setPreLogin(response)
      if (response.login_method === 'passwordless') {
        setIsPair(!isConnected || (!isDesktop && !service.pairingService?.hasKey))
      } else {
        setIsPair(false)
      }
    }).catch((error) => {
      setPreLogin(null)
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  const handleSave = async () => {

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
              <p className="text-3xl font-semibold">
                {t('auth_pages.authenticate.title')}
              </p>
              <ChangePasswordForm
                className={'mt-2'}
                isAuth={true}
                onCancel={handleCancel}
              />
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