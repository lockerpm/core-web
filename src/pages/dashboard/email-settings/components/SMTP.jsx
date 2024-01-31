import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Badge,
  Form,
  Input,
  Select
} from '@lockerpm/design';
import {
  ArrowRightOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../../utils/common';
import global from "../../../../config/global";

const SMTP = (props) => {
  const {
    className,
    callingAPI = false,
    editable = true,
    changeProvider = () => { }
  } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <div className="mb-6">
        <p className="mb-2">{t('email_settings.smtp.description')}</p>
        <div className="flex items-center">
          <Badge status="default" />
          <p className="ml-2">{t('email_settings.smtp.description1')}</p>
        </div>
        <div className="flex items-center">
          <Badge status="default" />
          <p className="ml-2">{t('email_settings.smtp.description2')}</p>
        </div>
        <p className="mt-2">
          {t('email_settings.smtp.note')}
        </p>
        <a
          className="flex items-center"
          href={'/'}
        >
          <span className="mr-2">{t('email_settings.smtp.note_link')}</span>
          <ArrowRightOutlined />
        </a>
      </div>
      <Row gutter={[16, 0]}>
        <Col lg={16} md={24} xs={24}>
          <Row gutter={[16, 0]}>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'provider'}
                label={
                  <p className="font-semibold">{t("email_settings.smtp.provider")}</p>
                }
              >
                <Select
                  placeholder={t('placeholder.select')}
                  className="w-full"
                  disabled={callingAPI || !editable}
                  onChange={(v) => changeProvider(v)}
                >
                  {global.constants.SMTP_PROVIDERS.map((p, index) => (
                    <Select.Option
                      value={index}
                      key={index}
                    >
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                name={'host'}
                label={
                  <p className="font-semibold">{t("email_settings.smtp.host")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.smtp.host")),
                ]}
              >
                <Input
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.smtp.host_placeholder')}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'port'}
                label={
                  <p className="font-semibold">{t("email_settings.smtp.port")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.smtp.port")),
                  global.rules.INVALID(t("email_settings.smtp.port"), 'PORT'),
                ]}
              >
                <Input
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.smtp.port_placeholder')}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'username'}
                label={
                  <p className="font-semibold">{t("email_settings.smtp.username")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.smtp.username")),
                ]}
              >
                <Input
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.smtp.username_placeholder')}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item
                name={'password'}
                label={
                  <p className="font-semibold">{t("email_settings.smtp.password")}</p>
                }
                rules={[
                  global.rules.REQUIRED(t("email_settings.smtp.password")),
                ]}
              >
                <Input.Password
                  disabled={callingAPI || !editable}
                  placeholder={t('email_settings.smtp.password_placeholder')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SMTP;