import React, { useState, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { CipherType } from '../../../../core-js/src/enums';

import cipherServices from '../../../../services/cipher';

import global from '../../../../config/global';
import common from '../../../../utils/common';

function FormData(props) {
  const {
    visible = false,
    item = null,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
      if (item?.id) {
        const formData = common.convertCipherToForm(item)
        form.setFieldsValue(formData)
      } else {
        const formData = common.convertCipherToForm({ type: CipherType.TOTP })
        form.setFieldsValue(formData)
      }
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, item])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      if (!item?.id) {
        await createCipher(values);
      } else {
        await editCipher(values);
      }
      setCallingAPI(false);
      onClose();
    })
  }

  const createCipher = async (values) => {
    const cipher = common.convertFormToCipher({ ...values, type: CipherType.TOTP });
    const { data } = await common.getEncCipherForRequest( cipher )
    const payload = { ...data, collectionIds: [] }
    await cipherServices.create(payload).then(() => {
      global.pushSuccess(t('notification.success.cipher.created'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editCipher = async (values) => {
    const cipher = {
      ...common.convertFormToCipher({ ...values, notes: item.notes, type: CipherType.TOTP }),
      id: item.id
    }
    const { data } = await common.getEncCipherForRequest(cipher)
    await cipherServices.update(item.id, data).then(() => {
      global.pushSuccess(t('notification.success.cipher.updated'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t( `inventory.authenticator.${item ? 'edit' : 'add'}`)}
        placement="right"
        onClose={onClose}
        open={visible}
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
          disabled={callingAPI}
          className='vault-form'
        >
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
            />
          </Form.Item>
          {
            !item?.id && <Form.Item
              name={'notes'}
              className='mb-2'
              label={
                <p className='font-semibold'>{t('cipher.otp.secret_key')}</p>
              }
              rules={[
                global.rules.REQUIRED(t('cipher.otp.secret_key'))
              ]}
            >
              <Input.Password
                placeholder={t('placeholder.enter')}
              />
            </Form.Item>
          }
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
