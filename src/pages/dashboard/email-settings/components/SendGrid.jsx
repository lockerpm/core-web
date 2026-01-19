import React from "react";

import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Form,
  Input
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import global from "../../../../config/global";

const SendGrid = (props) => {
  const {
    className,
    editable = true,
    callingAPI = false,
  } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Row gutter={[16, 0]}>
        <Col lg={16} md={24} xs={24}>
          <Row gutter={[16, 0]}>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'from_email'}
                label={
                  <p className="font-semibold">{t("email_settings.general.from_email")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.general.from_email")),
                  global.rules.INVALID(t("email_settings.general.from_email"), 'EMAIL'),
                ]}
              >
                <Input
                  autoFocus
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.general.from_email_placeholder')}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'from_name'}
                label={
                  <p className="font-semibold">{t("email_settings.general.from_name")}</p>
                }
              >
                <Input
                  autoFocus
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.general.from_name_placeholder')}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'api_key'}
                label={
                  <p className="font-semibold">{t("email_settings.send_grid.api_key")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.send_grid.api_key")),
                ]}
              >
                <Input
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.send_grid.api_key_placeholder')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SendGrid;