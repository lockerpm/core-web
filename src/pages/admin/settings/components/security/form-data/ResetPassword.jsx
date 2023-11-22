import React, { useState, useEffect } from 'react';
import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../../config/global';
import common from '../../../../../../utils/common';
import emergencyAccessServices from '../../../../../../services/emergency-access';
import commonServices from '../../../../../../services/common';

import { SymmetricCryptoKey } from '../../../../../../core-js/src/models/domain';
import { GeneratePassword } from '../../../../../../components';

function ResetMasterPasswordFormData(props) {
  const {
    item = null,
    visible = false,
    onClose = () => {},
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false);

  const newPassword = Form.useWatch('new_password', form) || ''

  useEffect(() => {
    form.resetFields();
    setCallingAPI(false);
  }, [visible])


  const handleConfirm = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true);
      const response = await emergencyAccessServices.takeover(item.id);
      const oldKeyBuffer = await global.jsCore.cryptoService.rsaDecrypt(response.key_encrypted);
      const oldEncKey = new SymmetricCryptoKey(oldKeyBuffer);
      if (!oldEncKey) {
        global.pushError(t('notification.error.message.error_occurred'))
        return;
      }
      const key = await global.jsCore.cryptoService.makeKey(
        values.new_password,
        item.email,
        response.kdf,
        response.kdf_iterations
      )
      const masterPasswordHash = await global.jsCore.cryptoService.hashPassword(
        values.new_password,
        key
      )
      const encKey = await global.jsCore.cryptoService.remakeEncKey(key, oldEncKey)
      const encMasterPwItem = await common.createEncryptedMasterPw(
        values.new_password,
        encKey[0]
      )
      const passwordStrength = await commonServices.password_strength(values.new_password);
      const payload = {
        key: encKey[1].encryptedString,
        new_master_password_hash: masterPasswordHash,
        score: passwordStrength.score,
        master_password_cipher: encMasterPwItem
      }
      await emergencyAccessServices.password(item.id, payload)
        .then(() => {
          global.pushSuccess(t('notification.success.emergency_access.takeover_password', { user: item.email }))
          setCallingAPI(false);
          onClose();
        }).catch((error) => {
          global.pushError(error)
        })
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('security.emergency_access.takeover.title')}
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
              onClick={handleConfirm}
            >
            { t('common.confirm') } 
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
            name={'new_password'}
            className='mb-2'
            label={t('security.emergency_access.takeover.new_master_password')}
            rules={[
              global.rules.REQUIRED(t('security.emergency_access.takeover.new_master_password')),
              global.rules.LATEST_LENGTH(t('security.emergency_access.takeover.new_master_password'), 8)
            ]}
          >
            <Input.Password
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
            />
          </Form.Item>
          <GeneratePassword
            password={newPassword}
            onFill={(v) => form.setFieldValue('new_password', v)}
          />
          <Form.Item
            name={'confirm_new_password'}
            label={t('security.emergency_access.takeover.re_new_master_password')}
            rules={[
              global.rules.REQUIRED(t('security.emergency_access.takeover.re_new_master_password')),
              global.rules.LATEST_LENGTH(t('security.emergency_access.takeover.re_new_master_password'), 8),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('new_password') !== value) {
                    return Promise.reject(new Error(t('validation.passwords_not_match')));
                  }
                  return Promise.resolve();
                },
              }),
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

export default ResetMasterPasswordFormData;
