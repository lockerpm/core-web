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

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

function PersonalForm(props) {
  const {
    form,
    disabled = false
  } = props
  const { t } = useTranslation()

  const titleOptions = [
    {
      label: t('common.mr'),
      value: 'mr',
    },
    {
      label: t('common.mrs'),
      value: 'mrs',
    },
    {
      label: t('common.ms'),
      value: 'ms',
    },
    {
      label: t('common.dr'),
      value: 'dr',
    },
  ]
  
  return (
    <div className={props.className}>
      <p className='mb-2 font-semibold'>
        {t('cipher.identity.personal_title')}
      </p>
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <Form.Item
            name={'title'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.title')}
              </p>
            }
          >
            <Select
              className='w-full'
              placeholder={t('placeholder.select')}
              options={titleOptions}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'firstName'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.first_name')}
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
            name={'lastName'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.last_name')}
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
            name={'username'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.username')}
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
            name={'company'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.company')}
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
            name={'email'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.email')}
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
            name={'phone'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.phone')}
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
            name={'ssn'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.social_security_number')}
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
            name={'passportNumber'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.passport_number')}
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
            name={'licenseNumber'}
            className='mb-2'
            label={
              <p className='text-gray'>
                {t('cipher.identity.license_number')}
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
    </div>
  );
}

export default PersonalForm;
