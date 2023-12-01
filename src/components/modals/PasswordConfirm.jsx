import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input
} from '@lockerpm/design';
import { PairingForm, PasswordlessForm } from "../../components";

import { useSelector } from 'react-redux';
import { orange } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { InfoCircleFilled } from "@ant-design/icons";

import global from "../../config/global";
import authServices from "../../services/auth";

const PasswordConfirmModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    danger = false,
    title = '',
    description = '',
    okText = '',
    callingAPI = false,
    width = 360,
    requireDesktop = false,
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);
  const isDesktop = useSelector(state => state.system.isDesktop);
  const isConnected = useSelector(state => state.service.isConnected);

  const [form] = Form.useForm();
  const [isPair, setIsPair] = useState(false)
  const [checking, setChecking] = useState(false);
  const [timeNow, setTimeNow] = useState(new Date().getTime());

  const password = Form.useWatch('password', form);
  
  useEffect(() => {
    form.resetFields();
    setChecking(false);
    setIsPair((requireDesktop || userInfo?.login_method === 'passwordless') && (!isConnected || (requireDesktop && !service.pairingService?.hasKey && !isDesktop)));
    setTimeNow(new Date().getTime())
  }, [visible])

  const handleConfirm = async () => {
    form.validateFields().then(async () => {
      setChecking(true)
      const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
      const storedKeyHash = await global.jsCore.cryptoService.getKeyHash()
      if (!!storedKeyHash && !!keyHash && storedKeyHash == keyHash) {
        onConfirm(password);
      } else {
        authServices.logout();
      }
      setChecking(false);
    })
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleFilled style={{
            color: orange[5]
          }}/>
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
      footer={userInfo?.login_method === 'password' && !isPair ? undefined : false}
      okButtonProps={{
        loading: checking || callingAPI,
        disabled: !password,
        danger: danger
      }}
      cancelButtonProps={{
        disabled: checking || callingAPI
      }}
    >
      <div key={timeNow}>
        { 
          isPair && <PairingForm
            callingAPI={callingAPI}
            userInfo={userInfo}
            onConfirm={() => setIsPair(false)}
          />
        }
        {
          !isPair && userInfo?.login_method === 'password' && <div>
            <div className="mb-2">
              {description || t('password_confirm.confirm_note')}
            </div>
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
          !isPair && userInfo?.login_method === 'passwordless' && <div>
            <div className="mb-2">
              {description || t('password_confirm.confirm_note')}
            </div>
            <PasswordlessForm
              changing={callingAPI}
              userInfo={userInfo}
              onError={() => setIsPair(true)}
              onConfirm={onConfirm}
            />
          </div>
        }
      </div>
    </Modal>
  );
}

export default PasswordConfirmModal;