import React, { useEffect } from "react";
import './css/auth.scss';

import { Image, Row, Col } from '@lockerpm/design';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "../../components";

import WelcomeImg from '../../assets/images/welcome.svg';
import userServices from "../../services/user";

import global from "../../config/global";

const Authenticate = () => {
  const { t } = useTranslation();
  const handleCancel = async () => {
    userServices.update_account_info(null)
    global.navigate('SIGN_IN', {}, {})
  }

  useEffect(() => {
  }, [])

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
              <p className="text-3xl font-semibold">
                {t('auth_pages.authenticate.title')}
              </p>
              <ChangePasswordForm
                className={'mt-4'}
                isAuth={true}
                onCancel={handleCancel}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className="welcome-page__top-right"></div>
    </div>

  );
}

export default Authenticate;