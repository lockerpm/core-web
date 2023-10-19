import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../config/global';
import common from '../../../../utils/common';

import folderServices from '../../../../services/folder';
import sharingServices from '../../../../services/sharing';

function FormData(props) {
  const {
    visible = false,
    item = null,
    setCloneMode = () => {},
    onClose = () => {},
    callback = () => {}
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
      if (item?.id) {
        form.setFieldsValue({ name: item.name })
      } else {
        form.setFieldsValue({ name: '' })
      }
    } else {
      setCloneMode(false);
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      if (!item?.id) {
        await createFolder(values);
      } else if (item?.organizationId) {
        await editCollection(values);
      } else {
        await editFolder(values);
      }
      setCallingAPI(false);
      onClose();
    })
  }

  const createFolder = async (values) => {
    const payload = await common.getEncFolderForRequest(values)
    await folderServices.create(payload).then((response) => {
      global.pushSuccess(t('notification.success.folder.created'))
      callback(response)
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editFolder = async (values) => {
    const payload = await common.getEncFolderForRequest(values)
    await folderServices.update(item.id, payload).then(() => {
      global.pushSuccess(t('notification.success.folder.updated'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editCollection = async (values) => {
    const orgKey = await global.jsCore.cryptoService.getOrgKey(item.organizationId)
    const payload = await common.getEncFolderForRequest({ ...item, ...values }, orgKey)
    await sharingServices.update_sharing_folder(item.organizationId, item.id, payload).then(() => {
      global.pushSuccess(t('notification.success.folder.updated'))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t( `inventory.folders.${item ? 'edit' : 'add'}`)}
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
        >
          <Form.Item
            name={'name'}
            className='mb-2'
            label={
              <p className='font-semibold'>{t('cipher.folder_name')}</p>
            }
            rules={[
              global.rules.REQUIRED(t('cipher.folder_name'))
            ]}
          >
            <Input
              placeholder={t('placeholder.enter')}
              disabled={callingAPI}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
