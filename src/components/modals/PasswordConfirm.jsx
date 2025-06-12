import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';

import {
  InfoCircleFilled
} from "@ant-design/icons";

import formsComponents from "../forms";

import global from "../../config/global";
import common from "../../utils/common";

const PasswordConfirmModal = (props) => {
  const { Pairing, SecurityKey, Passkey } = formsComponents;
  const { t } = useTranslation();

  const {
    visible = false,
    danger = false,
    title = '',
    description = '',
    okText = '',
    callingAPI = false,
    width = 360,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);
  const isConnected = useSelector(state => state.service.isConnected);

  const [form] = Form.useForm();
  const [isPair, setIsPair] = useState(false)
  const [checking, setChecking] = useState(false);
  const [timeNow, setTimeNow] = useState(new Date().getTime());
  const [unlockMethod, setUnlockMethod] = useState('');

  const inputPassword = Form.useWatch('password', form);

  useEffect(() => {
    common.getUnlockMethod().then((res) => {
      setUnlockMethod(res)
    })
  }, [])

  useEffect(() => {
    form.resetFields();
    setChecking(false);
    setTimeNow(new Date().getTime())
  }, [visible])

  useEffect(() => {
    if (unlockMethod === 'security_key') {
      setIsPair((!isConnected || !service.pairingService?.hasKey));
    } else {
      setIsPair(false);
    }
  }, [isConnected, unlockMethod])

  const handleConfirm = async (password) => {
    if (password) {
      await validatePassword(password)
    } else {
      form.validateFields().then(async (values) => {
        await validatePassword(values.password)
      })
    }
  }

  const validatePassword = async (password) => {
    setChecking(true)
    const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
    const storedKeyHash = await global.jsCore.cryptoService.getKeyHash()
    if (!!storedKeyHash && !!keyHash && storedKeyHash == keyHash) {
      onConfirm(password);
    } else {
      global.pushError({ message: t('validation.invalid', { name: t('lock.master_password') }) })
    }
    setChecking(false);
  }

  return (
    <Modal
      className="confirm-password"
      title={
        <div className="flex items-center">
          <InfoCircleFilled className="text-warning"/>
          <p className="ml-2">
            {title}
          </p>
        </div>
      }
      open={visible}
      width={width}
      okText={okText}
      onOk={() => handleConfirm()}
      onCancel={() => onClose()}
      footer={(!['security_key', 'passkey'].includes(unlockMethod) && !isPair) ? undefined : false}
      okButtonProps={{
        loading: checking || callingAPI,
        disabled: !inputPassword,
        danger: danger,
        size: "large"
      }}
      cancelButtonProps={{
        disabled: checking || callingAPI,
        size: "large"
      }}
    >
      <div className="mb-2">
        {description || t('password_confirm.confirm_note')}
      </div>
      <div key={timeNow}>
        {
          isPair && <Pairing
            callingAPI={callingAPI}
            userInfo={userInfo}
            onConfirm={() => setIsPair(false)}
          />
        }
        {
          !isPair && <div>
            {
              !['security_key', 'passkey'].includes(unlockMethod) && <div>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={() => handleConfirm()}
                >
                  <Form.Item
                    name={'password'}
                    rules={[
                      global.rules.REQUIRED(t('auth_pages.password')),
                    ]}
                  >
                    <Input.Password
                      autoFocus={true}
                      size="large"
                      placeholder={t('placeholder.enter')}
                      disabled={checking || callingAPI}
                    />
                  </Form.Item>
                </Form>
              </div>
            }
            {
              unlockMethod === 'security_key' && <div>
                <SecurityKey
                  changing={callingAPI}
                  userInfo={userInfo}
                  onConfirm={(p) => handleConfirm(p)}
                  onRepair={() => setIsPair(true)}
                />
              </div>
            }
            {
              unlockMethod === 'passkey' && <div>
                <Passkey
                  changing={callingAPI}
                  userInfo={userInfo}
                  onConfirm={(p) => handleConfirm(p)}
                />
              </div>
            }
          </div>
        }
      </div>
    </Modal>
  );
}

export default PasswordConfirmModal;