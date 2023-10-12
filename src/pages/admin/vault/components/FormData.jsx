import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
  Space,
  Button,
  Drawer,
  Select,
  Divider
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import PasswordForm from './forms/Password';

import global from '../../../../config/global';
import { CipherType } from '../../../../core-js/src/enums';

function FormData(props) {
  const {
    visible = false,
    item = null,
    cipherType = {},
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  const cipherTypes = global.constants.CIPHER_TYPES.filter((t) => t.isCreate)
  const type = Form.useWatch('type', form)

  useEffect(() => {
    if (visible) {
      if (item) {
        form.setFieldsValue({
          type: item.type
        })
      } else {
        form.setFieldsValue({
          type: cipherType.type || cipherTypes[0].type
        })
      }
    } else {
      form.resetFields();
    }
  }, [visible, cipherType])


  const handleSave = async () => {
    form.validateFields().then(async (value) => {
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t( `inventory.${cipherType.key}.${item ? 'edit' : 'add'}`)}
        placement="right"
        onClose={onClose}
        open={visible}
        width={400}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleSave}
            >
            { t('button.save') } 
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          {
            !cipherType.type && <Form.Item
              name={'type'}
              label={
                <p className='font-semibold'>{t('cipher.type')}</p>
              }
            >
              <Select
                className='w-full'
                options={cipherTypes.map((t) => ({ value: t.type, label: t.name }))}
              />
            </Form.Item>
          }
          <Form.Item
            name={'name'}
            label={
              <p className='font-semibold'>{t('cipher.item_name')}</p>
            }
            rules={[
              global.rules.REQUIRED(t('cipher.item_name'))
            ]}
          >
            <Input placeholder={t('placeholder.enter')}/>
          </Form.Item>
          {
            type === CipherType.Login && <PasswordForm />
          }
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
