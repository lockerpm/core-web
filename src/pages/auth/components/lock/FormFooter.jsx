import React from "react";
import { useTranslation } from "react-i18next";

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
    onUnlock = () => {},
    onLogout = () => {}
  } = props;
  return (
    <Row gutter={[8, 0]} className={className}>
      <Col span={12}>
        <Button
          className="w-full"
          size="large"
          disabled={callingAPI}
          loading={logging}
          onClick={() => onLogout()}
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
          onClick={onUnlock}
        >
          {t('lock.unlock')}
        </Button>
      </Col>
    </Row>
  );
}

export default FormFooter;