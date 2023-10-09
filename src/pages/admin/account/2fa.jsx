import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Steps,
  Collapse,
  Input,
  Button,
  Switch,
  Tooltip,
  Badge
} from '@lockerpm/design';
import {
  QuestionCircleOutlined
} from "@ant-design/icons";
import { AdminHeader } from "../../../components";
import './css/2fa.scss'

import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import { convertDateTime } from '../../../utils/common';

import QRCode from "react-qr-code";

import global from "../../../config/global";
import userServices from "../../../services/user";
import storeActions from "../../../store/actions"

const Account2FA = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const factor2 = useSelector((state) => state.auth.factor2);
  const [otp, setOtp] = useState('')
  const [callingAPI, setCallingAPI] = useState(false)

  const smartOtp = useMemo(() => {
    return factor2.user_factor2_infos.find((i) => i.method === 'smart_otp')
  }, [factor2])

  const enable2fa = () => {
    setCallingAPI(true);
    userServices.active2fa({ otp }).then(async () => {
      await userServices.factor2().then(async (factor2) => {
        dispatch(storeActions.updateFactor2(factor2))
        global.pushSuccess(t(`notification.success.factor2.${smartOtp.is_active ? 'disabled' : 'enabled'}`))
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
      setOtp('')
    }).catch((error) => {
      global.pushError(error)
      setCallingAPI(false);
    })
  }

  return (
    <div className="2fa layout-content">
      <AdminHeader
        title={<div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="mr-2">{t('2fa.title')}</p>
            <Tooltip
              title={
                <div>
                  <div className="flex items-center">
                    <p>
                      {t('account_details.2fa.setup_on')}
                    </p>
                    <Badge
                      className="mx-2"
                      status={smartOtp.is_active ? 'success' : 'default'}
                    />
                    <p>{t(`common.${smartOtp.is_active ? 'on' : 'off'}`)}</p>
                  </div>
                  {
                    smartOtp.revision_date && <p style={{ color: 'gray' }} className="text-xs">
                      ({convertDateTime(smartOtp.revision_date)})
                    </p>
                  }
                </div>
              }
              placement={'top'}
            >
              <QuestionCircleOutlined style={{ fontSize: 16 }}/>
            </Tooltip>
          </div>
          <Switch
            checked={smartOtp?.is_active}
            disabled={callingAPI}
            onChange={() => {}}
          />
        </div>}
        subtitle={t('2fa.description')}
        actions={[]}
      />
      <Row className="mt-4" gutter={[24, 24]}>
        <Col lg={8} md={8} sm={8} xs={24}>
          <p className="text-lg font-semibold mb-2">
            {t('2fa.name')}
          </p>
          <p>
            {t('2fa.name_description')}
          </p>
        </Col>
        <Col lg={16} md={16} sm={16} xs={24}>
          {
            !smartOtp.is_active && <div>
              <Steps
                direction="vertical"
                className="steps-2fa"
                items={[1, 2, 3, 4].map((step) => ({
                  status: 'process',
                  title: <Collapse
                    ghost={true}
                    expandIconPosition={'end'}
                    defaultActiveKey={["1"]}
                  >
                    <Collapse.Panel
                      header={<p className="font-semibold">
                        {t(`2fa.step${step}.title`)}
                      </p>}
                      key="1"
                    >
                      {
                        step !== 2 ? t(`2fa.step${step}.description`) : <Trans
                          i18nKey={`2fa.step${step}.description`}
                          values={{
                            key: smartOtp.secret,
                          }}
                          components={{
                            key: <b/>
                          }}
                        />
                      }
                    </Collapse.Panel>
                  </Collapse>,
                }))}
              />
              <div className="mb-4"> 
                <QRCode
                  size={200}
                  level="H"
                  value={smartOtp.uri}
                />
              </div>
            </div>
          }
          <p className="font-semibold">
            {t('2fa.enter_code')}
          </p>
          <div className="mt-2 flex items-center">
            <Input
              value={otp}
              className="w-1/2 mr-2"
              placeholder={t('placeholder.code')}
              disabled={callingAPI}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type={'primary'}
              disabled={!otp}
              loading={callingAPI}
              onClick={enable2fa}
            >
              { smartOtp.is_active ? t('button.disable') : t('button.enable')}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Account2FA;