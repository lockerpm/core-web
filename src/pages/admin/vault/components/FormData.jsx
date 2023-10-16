import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Input,
  Form,
  Space,
  Button,
  Drawer,
  Select,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import ItemName from './form-items/ItemName';
import Notes from './form-items/Notes';
import SelectFolder from './form-items/SelectFolder';
import CustomFields from './form-items/CustomFields';

import PasswordForm from './forms/Password';
import CardForm from './forms/Card';
import CryptoBackupForm from './forms/CryptoBackup';
import IdentityForm from './forms/Identity';

import global from '../../../../config/global';
import { CipherType } from '../../../../core-js/src/enums';
import { Cipher } from '../../../../core-js/src/models/domain';

import common from '../../../../utils/common';

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
  const type = Form.useWatch('type', form) || cipherType.type

  useEffect(() => {
    if (visible) {
      if (item?.id) {
        const formData = common.convertCipherToForm(item)
        form.setFieldsValue(formData)
      } else {
        const formData = common.convertCipherToForm({ type: cipherType.type || cipherTypes[0].type })
        form.setFieldsValue(formData)
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
        width={600}
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
          <ItemName
            className={'mb-4'}
            cipherTypes={cipherTypes}
            cipherType={cipherType}
            disabled={false}
          />
          <div className='mb-4'>
            {
              type === CipherType.Login && <PasswordForm
                form={form}
                disabled={false}
              />
            }
            {
              type === CipherType.Card && <CardForm
                form={form}
                disabled={false}
              />
            }
            {
              type === CipherType.CryptoWallet && <CryptoBackupForm
                form={form}
                disabled={false}
              />
            }
            {
              type === CipherType.Identity && <IdentityForm
                form={form}
                disabled={false}
              />
            }
          </div>
          <Notes
            className={'mb-4'}
            disabled={false}
          />
          <CustomFields
            className={'mb-4'}
            form={form}
            disabled={false}
          />
          <SelectFolder
            disabled={false}
          />
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
