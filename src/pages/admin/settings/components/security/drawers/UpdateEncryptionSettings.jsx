import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Form,
  Space,
  Button,
  Drawer,
  Select,
  InputNumber,
  Alert
} from '@lockerpm/design';

import {
  ArrowRightOutlined
} from "@ant-design/icons";

import itemsComponents from '../../../../../../components/items';
import securityModalsComponents from '../modals';

import common from '../../../../../../utils/common';
import global from '../../../../../../config/global';

import { KdfType } from '../../../../../../core-js/src/enums/kdfType';
import userServices from '../../../../../../services/user';
import authServices from '../../../../../../services/auth';

function UpdateEncryptionSettingsDrawer(props) {
  const { RouterLink } = itemsComponents;
  const { ConfirmEncryptionUpdateModal } = securityModalsComponents;
  const {
    visible = false,
    masterPassword,
    onClose = () => {},
  } = props
  const { t } = useTranslation(null, { keyPrefix: 'security.encryption_key_settings' })
  const { t: buttonT } = useTranslation(null, { keyPrefix: 'button' })
  const { t: commonT } = useTranslation()

  const userInfo = useSelector(state => state.auth.userInfo);

  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const kdf = Form.useWatch('kdf', form)

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        kdf: userInfo.kdf,
        kdf_iterations: userInfo.kdf_iterations,
        kdf_memory: (userInfo.kdf_memory || 0) / 1024,
        kdf_parallelism: userInfo.kdf_parallelism
      })
    } else {
      form.resetFields();
      setCallingAPI(false);
    }
  }, [visible, userInfo]);

  useEffect(() => {
    if (kdf === KdfType.ARGON2ID) {
      form.setFieldsValue({
        kdf: kdf,
        kdf_iterations: 2,
        kdf_memory: 16,
        kdf_parallelism: 1
      })
    } else {
      form.setFieldsValue({
        kdf: kdf,
        kdf_iterations: 600000,
        kdf_memory: null,
        kdf_parallelism: null
      })
    }
  }, [kdf])

  const handleUpdate = () => {
    if (userInfo.is_require_passwordless) {
      return;
    }
    form.validateFields().then(() => {
      setConfirmVisible(true)
    })
  }

  const handleConfirm = async () => {
    if (userInfo.is_require_passwordless) {
      return;
    }
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      await userServices.change_password({
        username: userInfo.email,
        login_method: 'password',
        password: masterPassword.login.password,
        kdf: userInfo.kdf,
        kdf_iterations: userInfo.kdf_iterations,
        kdf_memory: userInfo.kdf_memory,
        kdf_parallelism: userInfo.kdf_parallelism,
      }, {
        password: masterPassword.login.password,
        kdf: values.kdf,
        kdf_iterations: values.kdf_iterations,
        kdf_memory: values.kdf_memory * 1024,
        kdf_parallelism: values.kdf_parallelism
      }).then(async () => {
        global.pushSuccess(commonT('notification.success.change_password.changed'));
        setConfirmVisible(false);
        onClose();
        authServices.logout(true);
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('title')}
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
              {buttonT('cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              disabled={userInfo.is_require_passwordless}
              onClick={handleUpdate}
            >
            { buttonT('update')} 
            </Button>
          </Space>
        }
      >
        <Alert
          style={{ padding: 12 }}
          className='mb-4'
          message={
            <p
              className={`font-semibold`}
            >
              {t('form_data.security_note')}
            </p>
          }
          description={<div className='flex flex-col gap-4'>
            <ul style={{ paddingInlineStart: 24 }}>
              <li>
                {t('form_data.note1')}
              </li>
              <li>
                {t('form_data.note2')}
              </li>
              <li>
                {t('form_data.note3')}
              </li>
            </ul>
            <RouterLink
              className={'font-semibold'}
              label={t('form_data.explore_more')}
              icon={<ArrowRightOutlined />}
              onClick={() => {}}
            />
          </div>}
          type={'warning'}
        />
        <Form
          form={form}
          layout="vertical"
          labelAlign={'left'}
          disabled={userInfo.is_require_passwordless || callingAPI}
        >
          <Form.Item
            name={'kdf'}
            label={
              <p className='font-semibold'>{t('algorithm')}</p>
            }
            rules={[]}
          >
            <Select
              className='w-full'
              options={[
                {
                  value: KdfType.PBKDF2_SHA256,
                  label: 'PBKDF2'
                },
                {
                  value: KdfType.ARGON2ID,
                  label: 'ARGON2ID'
                }
              ]}
            />
          </Form.Item>
          {
            kdf === KdfType.PBKDF2_SHA256 && <Form.Item
              name={'kdf_iterations'}
              label={
                <p className='font-semibold'>{t('iterations')}</p>
              }
              rules={[]}
            >
              <InputNumber
                className='w-full'
                min={600000}
                max={1000000}
                formatter={(v) => common.separatorNumber(v)}
              />
            </Form.Item>
          }
          {
            kdf === KdfType.ARGON2ID && <>
              <Form.Item
                name={'kdf_iterations'}
                label={
                  <p className='font-semibold'>{t('iterations')}</p>
                }
                rules={[]}
              >
                <InputNumber
                  className='w-full'
                  min={2}
                  formatter={(v) => common.separatorNumber(v)}
                />
              </Form.Item>
              <Form.Item
                name={'kdf_memory'}
                min={16}
                label={
                  <p className='font-semibold'>{t('memory')}</p>
                }
                rules={[]}
              >
                <InputNumber className='w-full'/>
              </Form.Item>
              <Form.Item
                name={'kdf_parallelism'}
                min={1}
                label={
                  <p className='font-semibold'>{t('parallelism')}</p>
                }
                rules={[]}
              >
                <InputNumber className='w-full'/>
              </Form.Item>
            </>
          }
        </Form>
      </Drawer>
      <ConfirmEncryptionUpdateModal
        visible={confirmVisible}
        callingAPI={callingAPI}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => handleConfirm()}
      />
    </div>
  );
}

export default UpdateEncryptionSettingsDrawer;
