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

import { orange } from '@ant-design/colors';

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
    requireDesktop = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);
  const isConnected = useSelector(state => state.service.isConnected);

  const [form] = Form.useForm();
  const [isPair, setIsPair] = useState(false)
  const [checking, setChecking] = useState(false);
  const [timeNow, setTimeNow] = useState(new Date().getTime());

  const password = Form.useWatch('password', form);
  const unlockMethod = common.getUnlockMethod();

  useEffect(() => {
    form.resetFields();
    setChecking(false);
    setTimeNow(new Date().getTime())
  }, [visible])

  useEffect(() => {
    if (unlockMethod === 'security_key') {
      setIsPair((requireDesktop || userInfo?.login_method === 'passwordless') && (!isConnected || (requireDesktop && !service.pairingService?.hasKey)));
    } else {
      setIsPair(false);
    }
  }, [isConnected, userInfo])

  const handleConfirm = async () => {
    form.validateFields().then(async () => {
      setChecking(true)
      const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
      const storedKeyHash = await global.jsCore.cryptoService.getKeyHash()
      if (!!storedKeyHash && !!keyHash && storedKeyHash == keyHash) {
        onConfirm(password);
      } else {
        global.pushError({ message: t('validation.invalid', { name: t('lock.master_password') }) })
      }
      setChecking(false);
    })
  }

  return (
    <Modal
      className="confirm-password"
      title={
        <div className="flex items-center">
          <InfoCircleFilled style={{
            color: orange[5]
          }} />
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
      footer={(userInfo?.login_method === 'password' || !isPair) ? undefined : false}
      okButtonProps={{
        loading: checking || callingAPI,
        disabled: !password,
        danger: danger
      }}
      cancelButtonProps={{
        disabled: checking || callingAPI
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
                  form={form}
                  onFinish={handleConfirm}
                >
                  <Form.Item
                    name={'password'}
                    rules={[
                      global.rules.REQUIRED(t('auth_pages.password')),
                    ]}
                  >
                    <Input.Password
                      autoFocus={true}
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
                  onConfirm={onConfirm}
                  onRepair={() => setIsPair(true)}
                />
              </div>
            }
            {
              unlockMethod === 'passkey' && <div>
                <Passkey
                  changing={callingAPI}
                  userInfo={userInfo}
                  onConfirm={onConfirm}
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