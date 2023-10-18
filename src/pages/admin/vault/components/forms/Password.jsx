import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { GeneratePassword } from '../../../../../components'

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

function PasswordForm(props) {
  const {
    form,
    disabled = false
  } = props
  const { t } = useTranslation()

  const password = Form.useWatch('password', form) || ''
  
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
          disabled={disabled}
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
          disabled={disabled}
        />
      </Form.Item>
      <GeneratePassword
        password={password}
        disabled={disabled}
        onFill={(v) => form.setFieldValue('password', v)}
      />
      <Form.Item
        name={'uri'}
        className='mb-2'
        label={
          <p className='text-gray'>
            {t('cipher.password.website')}
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

export default PasswordForm;
