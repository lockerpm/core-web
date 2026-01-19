import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
} from '@lockerpm/design';

import formsComponents from '../../forms';
import cipherFormItemComponents from '../form-item';

import global from '../../../config/global';

function PasswordForm(props) {
  const { GeneratePassword } = formsComponents;
  const { Fido2Credentials, WebsiteAddresses } = cipherFormItemComponents;
  const {
    form,
    disabled = false,
    fido2Credentials,
    setFido2Credentials = () => {}
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
        rules={[
          global.rules.INVALID(t('cipher.password.username'), 'USERNAME')
        ]}
        label={
          <p className='text-black-500'>
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
          <p className='text-black-500'>
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
      {
        fido2Credentials.length > 0 && <Fido2Credentials
          disabled={disabled}
          fido2Credentials={fido2Credentials}
          setFido2Credentials={setFido2Credentials}
        />
      }
      <WebsiteAddresses
        form={form}
        disabled={disabled}
      />
    </div>
  );
}

export default PasswordForm;
