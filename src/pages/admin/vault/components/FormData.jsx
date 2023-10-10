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
    allItems = [],
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
          key: item.secret.key,
          value: item.secret.value,
          description: item.secret.description,
          environmentId: item.environmentId || null
        })
      } else {
        form.setFieldsValue({
          key: '',
          value: '',
          description: '',
          environmentId: null
        })
      }
    }
  }, [visible])


  const handleSave = async () => {
    form.validateFields().then(async (value) => {
      const secret = await secretServices.get_payload(value, selectedProject.id)
      let request = null
      setCallingAPI(true);
      if (item) {
        request = secretServices.update(selectedProject.id, item.id, secret)
      } else {
        request = secretServices.create(selectedProject.id, secret)
      }
      await request?.then(() => {
        onReload();
        onClose()
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={item ? t('secrets.edit') : t('secrets.new')}
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
            { item ? t('button.save') : t('button.create')} 
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
            name={'key'}
            className='mb-4'
            label={<div>
              <p className='font-bold'>{t('secret.key')}</p>
              <span>{t('secret.key_desc')}</span>
            </div>}
            rules={[
              global.rules.REQUIRED(t("secret.key")),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const envSecrets = allItems.filter((i) => i.id !== item?.id && i.environmentId == getFieldValue('environmentId') )
                  if (value && envSecrets.map((i) => i.secret.key?.toLowerCase()).includes(value?.toLowerCase())) {
                    return Promise.reject(new Error(t('validation.key_existed')));
                  }
                  return Promise.resolve();
                },
              })
            ]}
          >
            <Input
              size="medium"
              disabled={callingAPI}
              className='w-full'
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'value'}
            label={<div>
              <p className='font-bold'>{t('secret.value')}</p>
              <span>{t('secret.value_desc')}</span>
            </div>}
            rules={[
              global.rules.REQUIRED(t("secret.value"))
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              className='w-full'
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <Form.Item
            name={'description'}
            label={<div>
              <p className='font-bold'>{t('common.description')}</p>
            </div>}
            rules={[]}
          >
            <Input.TextArea
              disabled={callingAPI}
              className='w-full'
              placeholder={t('placeholder.description')}
            />
          </Form.Item>
          <Form.Item
            name={'environmentId'}
            label={<div>
              <p className='font-bold'>{t('secret.environment')}</p>
              <span>{t('secret.environment_desc')}</span>
            </div>}
          >
            <Select
              placeholder={t('placeholder.select')}
              className="w-full"
              disabled={callingAPI}
              dropdownRender={(menu) => (<>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div
                  className='text-primary cursor-pointer flex items-center px-2 py-1'
                  onClick={() => setFormVisible(true)}
                >
                  <PlusOutlined />
                  <p className='ml-2'>{t('button.new_environment')}</p>
                </div>
              </>)}
            >
              <Select.Option
                value={null}
                key={'all'}
              >
                {t('common.all_default')}
              </Select.Option>
              {[].map((env) => (
                <Select.Option
                  value={env.id}
                  key={env.id}
                >
                  {env.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormData;
