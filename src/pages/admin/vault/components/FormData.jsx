import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
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

import { CipherType } from '../../../../core-js/src/enums';

import global from '../../../../config/global';
import common from '../../../../utils/common';

import commonServices from '../../../../services/common';
import cipherServices from '../../../../services/cipher';

function FormData(props) {
  const {
    visible = false,
    item = null,
    cipherType = {},
    cloneMode = false,
    setCloneMode = () => {},
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
      setCloneMode(false);
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, cipherType])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      if (cloneMode || !item?.id) {
        await createCipher(values);
      } else {
        await editCipher(values);
      }
      setCallingAPI(false);
      onClose();
    })
  }

  const createCipher = async (values) => {
    const cipher = common.convertFormToCipher({ ...values, type: type });
    const passwordStrength = values.password ? commonServices.password_strength(values.password) : {};
    const { data, collectionIds } = await common.getEncCipherForRequest(
      cipher,
      {
        writeableCollections: await commonServices.get_writable_collections(),
        isNewCipher: true,
        cloneMode
      }
    )
    const payload = {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }
    await cipherServices.create(payload).then(() => {
      global.pushSuccess(t('notification.success.cipher.created'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editCipher = async (values) => {
    const cipher = common.convertFormToCipher({ ...values, type: type });
    const passwordStrength = values.password ? commonServices.password_strength(values.password) : {};
    const { data, collectionIds } = await common.getEncCipherForRequest(
      cipher,
      {
        writeableCollections: await commonServices.get_writable_collections(),
        nonWriteableCollections: await commonServices.get_writable_collections(true),
      }
    )
    const payload = {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }
    await cipherServices.update(item.id, payload).then(() => {
      global.pushSuccess(t('notification.success.cipher.updated'))
    }).catch((error) => {
      global.pushError(error)
    })
  }


  return (
    <div className={props.className}>
      <Drawer
        title={t( `inventory.${cipherType.key}.${item && !cloneMode ? 'edit' : 'add'}`)}
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
            disabled={callingAPI}
          />
          <div className='mb-4'>
            {
              type === CipherType.Login && <PasswordForm
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.Card && <CardForm
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.CryptoWallet && <CryptoBackupForm
                form={form}
                disabled={callingAPI}
              />
            }
            {
              type === CipherType.Identity && <IdentityForm
                form={form}
                disabled={callingAPI}
              />
            }
          </div>
          <Notes
            className={'mb-4'}
            disabled={callingAPI}
          />
          <CustomFields
            className={'mb-4'}
            form={form}
            disabled={callingAPI}
          />
          <SelectFolder
            disabled={callingAPI}
          />
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
