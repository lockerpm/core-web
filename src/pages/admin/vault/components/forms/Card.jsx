import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
  Row,
  Col,
  Select
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../config/global';

function CardForm(props) {
  const {
    form,
    disabled = false
  } = props
  const { t } = useTranslation()

  const expirationMonths = [
    {
      label: '----',
      value: null,
    },
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
      label: `${m}`.length === 1 ? `0${m}` : `${m}`,
      value: m
    }))
  ]
  
  return (
    <div className={props.className}>
      <p className='mb-2 font-semibold'>
        {t('cipher.card.title')}
      </p>
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <Form.Item
            name={'cardholderName'}
            className='mb-2'
            rules={[
              global.rules.REQUIRED(t('cipher.card.cardholder_name'))
            ]}
            label={
              <p className='text-gray'>
                {t('cipher.card.cardholder_name')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'number'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.card.card_number')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Form.Item
            name={'expMonth'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.card.expiration_month')}
              </p>
            }
          >
            <Select
              className='w-full'
              options={expirationMonths}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'expYear'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.card.expiration_year')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={'code'}
        className='mb-2'
        label={
          <p className='text-gray'>
            {t('cipher.card.security_code')}
          </p>
        }
      >
        <Input
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
}

export default CardForm;
