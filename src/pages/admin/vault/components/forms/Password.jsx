import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../config/global';

function PasswordForm(props) {
  const {
    form
  } = props
  const { t } = useTranslation()
  
  useEffect(() => {
  }, [])

  return (
    <div className={props.className}>
      <p className='mb-2 font-semibold'>
        {t('cipher.password.title')}
      </p>
      <Form.Item
        name={'username'}
        className='mb-2'
        label={
          <p className='text-gray'>
            {t('cipher.password.username')}
          </p>
        }
      >
        <Input
          placeholder={t('placeholder.enter')}
        />
      </Form.Item>
      <Form.Item
        name={'password'}
        className='mb-2'
        label={
          <p className='text-gray'>
            {t('cipher.password.password')}
          </p>
        }
      >
        <Input.Password
          placeholder={t('placeholder.enter')}
        />
      </Form.Item>
      <Form.Item
        name={'website'}
        className='mb-2'
        label={
          <p className='text-gray'>
            {t('cipher.password.website')}
          </p>
        }
      >
        <Input
          placeholder={t('placeholder.enter')}
        />
      </Form.Item>
    </div>
  );
}

export default PasswordForm;
