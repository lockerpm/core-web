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

function ChangeMasterPasswordFormData(props) {
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
        title={t('security.change_master_password.action')}
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
            { t('button.change') } 
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
            name={'current_master_password'}
            label={t('security.change_master_password.current_master_password')}
            rules={[
              global.rules.REQUIRED(t("security.change_master_password.current_master_password")),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'new_master_password'}
            label={t('security.change_master_password.new_master_password')}
            rules={[
              global.rules.REQUIRED(t("security.change_master_password.new_master_password")),
              global.rules.LATEST_LENGTH(t('security.change_master_password.new_master_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'re_new_master_password'}
            label={t('security.change_master_password.re_new_master_password')}
            rules={[
              global.rules.REQUIRED(t("security.change_master_password.re_new_master_password")),
              global.rules.LATEST_LENGTH(t('security.change_master_password.re_new_master_password'), 8),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('new_master_password') !== value) {
                    return Promise.reject(new Error(t('validation.passwords_not_match')));
                  }
                },
              }),
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'hint'}
            label={t('security.change_master_password.hint')}
            rules={[]}
          >
            <Input
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ChangeMasterPasswordFormData;
