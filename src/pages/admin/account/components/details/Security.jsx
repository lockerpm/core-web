import React, { useMemo } from "react";
import {
  Switch,
  Row,
  Col,
  Card,
  Badge
} from '@lockerpm/design';
import {
  UnlockOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../../config/global";
import { convertDateTime } from "../../../../../utils/common"

const Security = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const factor2 = useSelector((state) => state.auth.factor2);
  const dispatch = useDispatch();

  const smartOtp = useMemo(() => {
    return factor2.user_factor2_infos.find((i) => i.method === 'smart_otp')
  }, [factor2])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Card
            bodyStyle={{ padding: 16 }}
            hoverable
            onClick={() => {}}
          >
            <div>
              <UnlockOutlined />
            </div>
            <p className="font-semibold">
              {t('account_details.change_password')}
            </p>
          </Card>
        </Col>
        <Col lg={12} md={12} sm={12} xs={24}>
          <Card
            bodyStyle={{ padding: 16 }}
            hoverable
            onClick={() => {}}
          >
            <div className="flex justify-between">
              <SecurityScanOutlined />
              <Switch checked={smartOtp?.is_active} onChange={() => {}} />
            </div>
            <p className="font-semibold">
              {t('account_details.2fa.setup')}
            </p>
          </Card>
          <div className="flex items-center text-xs mt-1">
            <p>
              {t('account_details.2fa.setup_on')}
            </p>
            <Badge
              className="mx-2"
              status={smartOtp.is_active ? 'success' : 'default'}
            />
            <p>
              {t(`common.${smartOtp.is_active ? 'on' : 'off'}`)} <span>
                {
                  smartOtp.revision_date && `(${convertDateTime(smartOtp.revision_date)})`
                }
              </span>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Security;