import React, { useEffect, useState } from "react";
import {
  Drawer,
  Space,
  Button,
  Form,
  Input
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";


import {
} from "@ant-design/icons";
import global from "../../../../../config/global";

const CheckForm = (props) => {
  const {
    className = '',
    visible = false,
    onClose = () => {}
  } = props;
  const { t } = useTranslation();
  const [callingAPI, setCallingAPI] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ username: null })
    }
  }, [visible])

  const handleCheckBreaches = () => {
  }

  return (
    <Drawer
      title={t('security_tools.data_breach_scanner.title')}
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
            onClick={handleCheckBreaches}
          >
          { t('security_tools.data_breach_scanner.action') } 
          </Button>
        </Space>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: t('security_tools.data_breach_scanner.content_title') }}/>
      <Form
        form={form}
        layout="vertical"
        labelAlign={'left'}
      >
        <Form.Item
          name={'username'}
          className='my-2'
          label={<div>
            <p className='font-semibold'>{t('security_tools.data_breach_scanner.input_label')}</p>
          </div>}
          rules={[
            global.rules.REQUIRED(t('common.username_or_email'))
          ]}
        >
          <Input
            placeholder={t('placeholder.enter')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default CheckForm;
