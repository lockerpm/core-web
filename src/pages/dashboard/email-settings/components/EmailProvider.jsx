import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Image,
  Button,
  Badge
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../components'

import {
} from '../../../../utils/common'

import {
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

const General = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    mailConfig = null,
    mailProviders = [],
    selectedProvider = 'smtp',
    onSelect = () => { }
  } = props;

  return (
    <div className={className}>
      <p className="font-semibold text-xl">{t('email_settings.email_provider.title')}</p>
      <p className="mt-1">{t('email_settings.email_provider.description')}</p>
      <Row
        className="mt-4"
        gutter={[16, 16]}
      >
        {
          mailProviders.map((provider) => <Col
            key={provider.id}
            lg={4}
            md={6}
            sm={8}
            xs={12}
            style={{ width: 'max-content' }}
          >
            <Badge
              count={t('common.coming_soon')}
              className="w-full"
              offset={[-46, 0]}
              color={green[0]}
              style={{
                color: green.primary,
                display: !provider.available ? '' : 'none'
              }}
            >
              <Button
                className="w-full"
                disabled={!provider.available}
                ghost={mailConfig?.mail_provider === provider.id ? false : selectedProvider === provider.id}
                type={mailConfig?.mail_provider === provider.id || selectedProvider === provider.id ? 'primary' : 'default'}
                style={{
                  minWidth: 130,
                  padding: 12,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => onSelect(provider.id)}
              >
                <Image
                  style={{ width: 32, height: 32 }}
                  src={require(`../../../../assets/images/icons/email-provider/${provider.id}.svg`)}
                  preview={false}
                />
                <p className="ml-2 font-semibold text-limited">
                  {provider.name}
                </p>
              </Button>
            </Badge>
          </Col>)
        }
      </Row>
    </div>
  );
}

export default General;
