import React, { useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Form,
  Select,
  Image
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import formsComponents from '../../forms';
import cipherFormItemComponents from '../form-item';

import global from '../../../config/global';

function CryptoBackupForm(props) {
  const { GeneratePassword } = formsComponents;
  const { SeedPhrase } = cipherFormItemComponents;

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
        {t('cipher.crypto_backup.title')}
      </p>
      <Form.Item
        name={'walletApp'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.wallet_app')}
          </p>
        }
      >
        <Select
          className='w-full'
          disabled={disabled}
          placeholder={t('placeholder.wallet_app')}
          options={global.constants.WALLET_APPS.map((c) => ({
            value: c.alias,
            label: <div>
              <Image
                className={'mr-1'}
                style={{ width: 18, height: 18 }}
                preview={false}
                src={c.icon}
              />
              {c.name}
            </div>
          }))}
        />
      </Form.Item>
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
      {
        !disabled && <GeneratePassword
          password={password}
          onFill={(v) => form.setFieldValue('password', v)}
        />
      }
      <Form.Item
        name={'pin'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.pin')}
          </p>
        }
      >
        <Input.Password
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        name={'address'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.wallet_address')}
          </p>
        }
      >
        <Input
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        name={'privateKey'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.private_key')}
          </p>
        }
      >
        <Input
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        name={'seed'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.seed_phrase')}
          </p>
        }
      >
        <SeedPhrase disabled={disabled}/>
      </Form.Item>
      <Form.Item
        name={'networks'}
        className='mb-2'
        label={
          <p className='text-black-500'>
            {t('cipher.crypto_backup.networks')}
          </p>
        }
      >
        <Select
          className='w-full'
          mode="multiple"
          disabled={disabled}
          placeholder={t('placeholder.networks')}
          options={global.constants.CHAINS.map((c) => ({
            value: c.alias,
            label: <div>
              <Image
                className={'mr-1'}
                style={{ width: 18, height: 18 }}
                preview={false}
                src={c.logo}
              />
              {c.name}
            </div>
          }))}
        />
      </Form.Item>
    </div>
  );
}

export default CryptoBackupForm;
