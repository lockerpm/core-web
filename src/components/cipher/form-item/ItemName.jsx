import React, { useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Input,
  Select,
  Form,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import global from '../../../config/global';

function ItemName(props) {
  const {
    cipherType,
    cipherTypes,
    disabled = false,
    onChange = () => {}
  } = props
  const { t } = useTranslation()

  useEffect(() => {
  }, [])

  return (
    <div className={props.className}>
      {
        !cipherType.type && <Form.Item
          className='mb-2'
          name={'type'}
          label={
            <p className='font-semibold'>{t('cipher.type')}</p>
          }
        >
          <Select
            className='w-full'
            disabled={disabled}
            options={cipherTypes.map((type) => ({ value: type.type, label: t(type.name) }))}
            onChange={onChange}
          />
        </Form.Item>
      }
      <Form.Item
        name={'name'}
        className='mb-2'
        label={
          <p className='font-semibold'>{t('cipher.item_name')}</p>
        }
        rules={[
          global.rules.REQUIRED(t('cipher.item_name'))
        ]}
      >
        <Input
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
}

export default ItemName;
