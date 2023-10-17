import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
} from '@lockerpm/design';
import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

function Notes(props) {
  const {
    form,
    disabled = false
  } = props
  const { t } = useTranslation()
  
  useEffect(() => {
  }, [])

  return (
    <div className={props.className}>
      <Form.Item
        name={'notes'}
        className='mb-2'
        label={
          <p className='font-semibold'>{t('cipher.notes')}</p>
        }
      >
        <Input.TextArea
          rows={4}
          placeholder={t('placeholder.enter')}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
}

export default Notes;
