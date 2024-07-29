import React, { } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Row,
  Col,
  Select
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import global from '../../../config/global';

function CardForm(props) {
  const {
    disabled = false
  } = props
  const { t } = useTranslation()
  
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
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.card.card_number'), 'CARD_NUMBER')
            ]}
            label={
              <p className='text-black-500'>
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
              <p className='text-black-500'>
                {t('cipher.card.expiration_month')}
              </p>
            }
          >
            <Select
              className='w-full'
              placeholder={t('placeholder.select')}
              options={global.constants.EXP_MONTH_OPTIONS}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'expYear'}
            className='mb-2'
            rules={[
              global.rules.INVALID(t('cipher.card.expiration_year'), 'EXPIRATION_YEAR')
            ]}
            label={
              <p className='text-black-500'>
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
        rules={[
          global.rules.INVALID(t('cipher.card.security_code'), 'CVV')
        ]}
        label={
          <p className='text-black-500'>
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
