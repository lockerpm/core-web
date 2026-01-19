import React, { } from 'react';

import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Row,
  Col,
  Select
} from '@lockerpm/design';

import global from '../../../config/global';

function PersonalForm(props) {
  const {
    disabled = false
  } = props
  const { t } = useTranslation()

  const titleOptions = [
    {
      value: 'mr',
    },
    {
      value: 'mrs',
    },
    {
      value: 'ms',
    },
    {
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
              <p className='text-black-500'>
                {t('cipher.identity.title')}
              </p>
            }
          >
            <Select
              className='w-full'
              placeholder={t('placeholder.select')}
              options={titleOptions.map((c) => ({
                ...c,
                label: t(`common.${c.value}`)
              }))}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'firstName'}
            className='mb-2'
            label={
              <p className='text-black-500'>
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
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.password.username'), 'USERNAME')
            ]}
            label={
              <p className='text-black-500'>
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
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.identity.email'), 'EMAIL')
            ]}
            label={
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.identity.phone'), 'PHONE')
            ]}
            label={
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.identity.social_security_number'), 'NUMBER')
            ]}
            label={
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.identity.passport_number'), 'PASSPORT_NUMBER')
            ]}
            label={
              <p className='text-black-500'>
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
            rules={[
              global.rules.INVALID(t('cipher.identity.license_number'), 'LICENSE_NUMBER')
            ]}
            label={
              <p className='text-black-500'>
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
