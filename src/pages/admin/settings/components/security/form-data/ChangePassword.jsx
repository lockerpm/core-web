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

import global from '../../../../../../config/global';

function ChangePasswordFormData(props) {
  const {
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      setCallingAPI(false);
      onClose();
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('change_password.title')}
        placement="right"
        onClose={onClose}
        open={visible}
        width={500}
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
        <p className='mb-2'>{t('change_password.subtitle')}</p>
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
        >
          <Form.Item
            name={'password'}
            label={t('change_password.current_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.current_password")),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'new_password'}
            label={t('change_password.new_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.new_password")),
              global.rules.LATEST_LENGTH(t('change_password.new_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'confirm_new_password'}
            label={t('change_password.confirm_new_password')}
            rules={[
              global.rules.REQUIRED(t("change_password.confirm_new_password")),
              global.rules.LATEST_LENGTH(t('change_password.confirm_new_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ChangePasswordFormData;
