import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Row,
  Col,
  Select,
  Image
} from '@lockerpm/design';

import global from '../../../config/global';
import common from '../../../utils/common';

function CardForm(props) {
  const { t } = useTranslation()
  const {
    form,
    disabled = false
  } = props

  const number = Form.useWatch('number', form) || ''
  
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
              addonAfter={
                <Image
                  style={{ width: 18, height: 18 }}
                  preview={false}
                  src={common.cardBrandByNumber(number).icon}
                />
              }
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
              global.rules.INVALID_EXPIRATION_YEAR()
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
        <Input.Password
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
}

export default CardForm;
