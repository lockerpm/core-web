import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Badge,
  Row,
  Col,
  Card,
  Tooltip
} from '@lockerpm/design';

import {
  MobileOutlined,
  DownOutlined,
  RightOutlined,
  MailOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

import modalsComponents from "../../../../../components/modals";
import securityFormDataComponents from "./form-data";

import authServices from "../../../../../services/auth";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const TwoFA = (props) => {
  const { SmartOtpFormData, MailOtpFormData } = securityFormDataComponents;
  const { PasswordConfirmModal} = modalsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo);
  const isMobile = useSelector(state => state.system.isMobile);

  const [smartOtpVisible, setSmartOtpVisible] = useState(false);
  const [mailOtpVisible, setMailOtpVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const [factor2, setFactor2] = useState(null);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    getFactor2();
  }, [])

  const getFactor2 = async () => {
    const result = await authServices.get_factor2();
    setFactor2(result)
  }

  const handleTurnOff = async (password) => {
    const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
    setCallingAPI(true);
    await authServices.factor2_activate({
      password: keyHash
    }).then(() => {
      global.pushSuccess(t('notification.success.factor2.disabled'));
      getFactor2();
      setConfirmVisible(false);
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  const openForm = (callback = () => { }, is_activate) => {
    if (userInfo.is_require_2fa) {
      const isActivateAll = factor2?.mail_otp?.is_activate && factor2?.smart_otp?.is_activate
      if (is_activate && !isActivateAll) {
        global.pushError(t('security.two_fa.require_2fa'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.two_fa.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        {
          factor2?.is_factor2 && <Tooltip
            title={userInfo?.is_require_2fa ? t('security.two_fa.require_2fa') : ''}
          >
            <Button
              type='primary'
              ghost
              icon={<MinusCircleOutlined />}
              disabled={userInfo?.is_require_2fa}
              onClick={() => setConfirmVisible(true)}
            >
              {isMobile ? '' : t('security.two_fa.turn_off')}
            </Button>
          </Tooltip>
        }
      </div>
      {
        factor2?.updated_time ? <div className="flex items-center mt-1">
          <p>
            {t('security.two_fa.setup_on')}
          </p>
          <Badge
            className="mx-2"
            status={factor2?.is_factor2 ? 'success' : 'default'}
          />
          <p>
            {t(`common.${factor2?.is_factor2 ? 'on' : 'off'}`)} <span>
              {`(${common.convertDateTime(factor2?.updated_time)})`}
            </span>
          </p>
        </div> : <p className="mt-1">
          {t('security.two_fa.description')}
        </p>
      }
      {
        expand && <div className="mt-4">
          <p className="font-semibold" style={{ fontSize: 16 }}>
            {t('security.two_fa.your_second_step')}
          </p>
          <p className="mt-1">
            {t('security.two_fa.your_second_step_description')}
          </p>
          <div className="mt-4">
            <Row gutter={[12, 12]}>
              {
                factor2?.mail_otp && <Col lg={12} md={24} xs={24}>
                  <Card
                    className="w-full cursor-pointer"
                    bodyStyle={{ padding: 16 }}
                    style={{ borderColor: factor2?.mail_otp?.is_activate ? green[6] : '' }}
                    onClick={() => openForm(() => setMailOtpVisible(true), factor2?.mail_otp?.is_activate)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MailOutlined style={{ fontSize: 24 }} />
                        <p className="ml-2 font-semibold">
                          {t('security.two_fa.email_otp.name')}
                        </p>
                      </div>
                      {
                        factor2?.mail_otp?.is_activate
                          ? <CheckCircleOutlined className="text-primary" style={{ fontSize: 20 }} />
                          : <MinusCircleOutlined style={{ fontSize: 20 }} />
                      }
                    </div>
                  </Card>
                </Col>
              }
              <Col lg={12} md={24} xs={24}>
                <Card
                  className="w-full cursor-pointer"
                  bodyStyle={{ padding: 16 }}
                  style={{ borderColor: factor2?.smart_otp?.is_activate ? green[6] : '' }}
                  onClick={() => openForm(() => setSmartOtpVisible(true), factor2?.smart_otp?.is_activate)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MobileOutlined style={{ fontSize: 24 }} />
                      <p className="ml-2 font-semibold">
                        {t('security.two_fa.smart_otp.name')}
                      </p>
                    </div>
                    {
                      factor2?.smart_otp?.is_activate
                        ? <CheckCircleOutlined className="text-primary" style={{ fontSize: 20 }} />
                        : <MinusCircleOutlined style={{ fontSize: 20 }} />
                    }
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      }
      <SmartOtpFormData
        visible={smartOtpVisible}
        factor2={factor2}
        onReload={getFactor2}
        onClose={() => setSmartOtpVisible(false)}
      />
      <MailOtpFormData
        visible={mailOtpVisible}
        factor2={factor2}
        onReload={getFactor2}
        onClose={() => setMailOtpVisible(false)}
      />
      <PasswordConfirmModal
        visible={confirmVisible}
        title={t('security.two_fa.turn_off')}
        callingAPI={callingAPI}
        okText={t('button.confirm')}
        onConfirm={handleTurnOff}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
}

export default TwoFA;
