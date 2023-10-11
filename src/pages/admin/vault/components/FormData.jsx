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
  PlusOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from '../../../../utils/common';

import global from '../../../../config/global';

function FormData(props) {
  const {
    visible = false,
    item = null,
    cipherType = {},
    onClose = () => {},
    onReload = () => {}
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      if (item) {
        form.setFieldsValue({
        })
      } else {
        form.setFieldsValue({
        })
      }
    }
  }, [visible])


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
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
