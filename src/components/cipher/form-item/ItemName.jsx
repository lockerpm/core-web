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
    item = null,
    cipherType,
    cipherTypes,
    disabled = false,
    isTutorial = false,
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
            popupClassName='item-type-options'
            defaultOpen={isTutorial}
            disabled={disabled || !!item?.id}
            options={cipherTypes.map((type) => ({ value: type.type, label: t(type.name), className: `item-type-option-${type.type}` }))}
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
