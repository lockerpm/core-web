import React, { } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Row,
  Col,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

function ContactForm(props) {
  const {
    disabled = false
  } = props
  const { t } = useTranslation()

  return (
    <div className={props.className}>
      <p className='mb-2 font-semibold'>
        {t('cipher.identity.contact_title')}
      </p>
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <Form.Item
            name={'address1'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.address1')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={'address2'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.address2')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={'city'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.city_town')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={'state'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.state_province')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={'postalCode'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.zip_postal')}
              </p>
            }
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={'country'}
            className='mb-2'
            label={
              <p className='text-black-500'>
                {t('cipher.identity.country')}
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

export default ContactForm;
