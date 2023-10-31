import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input,
  Select,
  Radio
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../../config/global';

function EmergencyContactFormData(props) {
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
        title={t('security.emergency_access.emergency_contact.invite')}
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
            { t('button.add') } 
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
            name={'email'}
            className='mb-2'
            label={
              <p className='font-semibold'>
                {t('common.email')}
              </p>
            }
            rules={[
              global.rules.REQUIRED(t('common.email')),
              global.rules.INVALID(t('common.email'), 'EMAIL')
            ]}
          >
            <Input
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'type'}
            className='mb-2'
            label={
              <p className='font-semibold'>
                {t('security.emergency_access.emergency_contact.user_access')}
              </p>
            }
            rules={[]}
          >
            <Radio.Group>
              {
                global.constants.USER_ACCESSES.map((u) => <Radio
                  key={u.value}
                  value={u.value}
                >
                  <div>
                    <p className='font-semibold'>{u.label}</p>
                    <small>{u.description}</small>
                  </div>
                </Radio>)
              }
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={'wait_time_days'}
            className='mb-2'
            label={
              <p className='font-semibold'>
                {t('security.emergency_access.emergency_contact.wait_time')}
              </p>
            }
            rules={[]}
          >
            <Select
              className='w-full'
              placeholder={t('placeholder.select')}
              options={global.constants.WAIT_TIMES}
            />
          </Form.Item>
          <p>{t('security.emergency_access.emergency_contact.wait_time_description')}</p>
        </Form>
      </Drawer>
    </div>
  );
}

export default EmergencyContactFormData;
