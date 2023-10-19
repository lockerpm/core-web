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

import SelectFolder from './form-items/SelectFolder';
import FolderFormData from "../../folders/components/FormData";

function MoveFolder(props) {
  const {
    visible = false,
    cipherIds = [],
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [folderVisible, setFolderVisible] = useState(false);

  const folderId = Form.useWatch('folderId', form)

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({});
    } else {
      setCallingAPI(false);
    }
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      onClose();
      setCallingAPI(false);
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t( 'inventory.move_to.title')}
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
            { t('button.update') } 
            </Button>
          </Space>
        }
      >
        <p className='mb-2'>
          {t('inventory.move_to.description', { amount: cipherIds.length })}
        </p>
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <SelectFolder
            disabled={callingAPI}
            isMove={true}
            onCreate={() => setFolderVisible(true)}
          />
        </Form>
      </Drawer>
      <FolderFormData
        visible={folderVisible}
        onClose={() => setFolderVisible(false)}
        callback={(res) => {
          setTimeout(() => {
            form.setFieldValue('folderId', res.id)
          }, 2000);
        }}
      />
    </div>
  );
}

export default MoveFolder;
