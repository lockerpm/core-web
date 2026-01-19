import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";

import {
  Form,
  Space,
  Button,
  Drawer,
  Input,
  Select,
  Radio
} from '@lockerpm/design';

import sharingServices from '../../../../../../services/sharing';
import emergencyAccessServices from '../../../../../../services/emergency-access';

import common from '../../../../../../utils/common';
import global from '../../../../../../config/global';

function EmergencyContactFormData(props) {
  const {
    visible = false,
    onClose = () => {},
    onReload = () => {}
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        email: null,
        type: global.constants.ACCESS_TYPE.VIEW,
        wait_time_days: global.constants.WAIT_TIMES[0].value
      })
    } else {
      form.resetFields();
    }
    setCallingAPI(false);
  }, [visible])
  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      await createEmergencyContact(values);
      setCallingAPI(false);
      onClose();
    })
  }

  const createEmergencyContact = async (values) => {
    const { public_key: publicKey } = await sharingServices.get_public_key({ email: values.email });
    const key = await common.generateAccessKey(publicKey);
    await emergencyAccessServices.invite({
      ...values,
      key
    }).then(() => {
      global.pushSuccess(t('notification.success.emergency_access.invited'));
      onReload();
      onClose();
    }).catch((error) => {
      global.pushError(error)
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
                    <p className='font-semibold'>{t(u.label)}</p>
                    <small>{t(u.description)}</small>
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
              options={global.constants.WAIT_TIMES
                .map((o) => ({
                  ...o,
                  label: t(o.label, {number:  o.value}) })
                )
              }
            />
          </Form.Item>
          <p>{t('security.emergency_access.emergency_contact.wait_time_description')}</p>
        </Form>
      </Drawer>
    </div>
  );
}

export default EmergencyContactFormData;
