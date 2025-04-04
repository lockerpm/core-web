import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Row,
  Col,
} from '@lockerpm/design';

import {
  LoadingOutlined
} from "@ant-design/icons";

const FormFooter = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    logging = false,
    callingAPI = false,
    onUnlock = () => {},
    onLogout = () => {}
  } = props;
  return (
    <Row gutter={[8, 0]} className={className}>
      <Col span={12} style={{ order: 2 }}>
        <Button
          className="w-full"
          size="large"
          type="primary"
          htmlType="submit"
          disabled={logging}
          loading={callingAPI}
          onClick={onUnlock}
        >
          {t('lock.unlock')}
        </Button>
      </Col>
      <Col span={12} style={{ order: 1 }}>
        <div
          className={`pm-button w-full ${logging ? 'pm-button__loading' : ''} ${callingAPI ? 'pm-button__disabled' : ''}`}
          onClick={() => onLogout()}
        >
          { logging && <LoadingOutlined className="mr-2"/> }
          {t('sidebar.logout')}
        </div>
      </Col>
    </Row>
  );
}

export default FormFooter;