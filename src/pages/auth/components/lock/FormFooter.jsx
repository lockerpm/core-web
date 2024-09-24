import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from 'react-router-dom';

import {
  Button,
  Row,
  Col,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

const FormFooter = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    logging = false,
    callingAPI = false,
    handleUnlock = () => {},
    handleLogout = () => {}
  } = props;
  return (
    <Row gutter={[8, 0]} className={className}>
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
  );
}

export default FormFooter;