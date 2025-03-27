import React, { useState, useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Drawer,
  Upload,
  message,
  Card
} from '@lockerpm/design';

import {
  CloudUploadOutlined
} from '@ant-design/icons';

import itemsComponents from '../../../../components/items';

import { CipherType } from '../../../../core-js/src/enums';

import cipherServices from '../../../../services/cipher';

import global from '../../../../config/global';
import common from '../../../../utils/common';

function FormAttachment(props) {
  const {
    Attachment
  } = itemsComponents;

  const {
    className = '',
    visible = false,
    item = null,
    onClose = () => {},
  } = props
  const { t } = useTranslation();

  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
    } else {
    }
  }, [visible])

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: '*/*',
    beforeUpload: async (file) => {
      const fileType = file.type;
      const isJpgOrPng = fileType.includes('image');

      if (!isJpgOrPng) {
        message.error(t('drag_upload.invalid', { type: 'IMAGE' }));
      }
    },
  };

  return (
    <div className={className}>
      <Drawer
        className="vault-attachment-form-drawer"
        title={'File Attachment'}
        placement="right"
        onClose={() => {}}
        open={visible}
        width={600}
        closable={false}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              className="vault-attachment-form-close-btn"
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.close')}
            </Button>
          </Space>
        }
      >
        <div className='flex flex-col gap-6'>
          <div>
            <Upload.Dragger
              {...uploadProps}
              style={{
                borderRadius: 12
              }}
            >
              <div
                className="flex items-center justify-center flex-col gap-2"
              >
                <Card
                  bodyStyle={{
                    padding: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  style={{ width: 40, height: 40 }}
                  className='rounded-md'
                >
                  <CloudUploadOutlined className='text-[20px]'/>
                </Card>
                <p className="ant-upload-text" style={{ marginBottom: 0 }}>
                  <span className="text-primary font-semibold">
                    {t('drag_upload.action')}
                  </span>
                </p>
                <p className="text-black-500">
                  SVG, PNG, JPG, GIF,... (max size is 50MB)
                </p>
              </div>
            </Upload.Dragger>
          </div>
          <div className='flex flex-col gap-3'>
            {
              [1,2,3, 1,2,3, 1,2,3, 1,2,3, 1,2,3].map((item, index) => (
                <Attachment key={index} data={item}/>
              ))
            }
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default FormAttachment;
