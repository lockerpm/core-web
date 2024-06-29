import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
  Form,
  Input,
  Button
} from '@lockerpm/design';

import { } from "@ant-design/icons";

import { red } from '@ant-design/colors';

import QRCode from "react-qr-code";

import { Utils } from "../../../../../../core-js/src/misc/utils";

import global from "../../../../../../config/global";

const QrCodeModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    width = 360,
    onClose = () => {},
  } = props;

  const [form] = Form.useForm();
  const [timeNow, setTimeNow] = useState(new Date().getTime());
  const [callingAPI, setCallingAPI] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [expireCountdown, setExpireCountdown] = useState(30);

  const handleContinue = async (values) => {
    setExpireCountdown(30);
    setCallingAPI(true);
    const keyObj = await global.jsCore.cryptoService.getKey()
    const keyHash = await global.jsCore.cryptoService.getKeyHash()
    const key = (values.otp + values.otp + values.otp).slice(0, 16)
    const keyBuff = Utils.fromUtf8ToArray(key).buffer
    const iv = await global.jsCore.cryptoFunctionService.randomBytes(16)
    const data = `${keyHash}.${keyObj.keyB64}.${keyObj.encType}`
    const dataBuff = Utils.fromUtf8ToArray(data).buffer
    const encryptBuffer = await global.jsCore.cryptoFunctionService.aesEncrypt(dataBuff, iv, keyBuff)
    const encryptB64 = Utils.fromBufferToB64(encryptBuffer)

    const qrValue = `${Utils.fromBufferToB64(iv)}.${encryptB64}`;
    setQrValue(qrValue);
    setCallingAPI(false);
    let expCountdown = 30
    const interval = setInterval(() => {
      expCountdown = expCountdown - 1
      setExpireCountdown(expCountdown)
      if (expCountdown === 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  return (
    <Modal
      title={t('security.mobile_passwordless.action')}
      open={visible}
      width={width}
      onCancel={() => onClose()}
      footer={false}
    >
      <div key={timeNow}>
        
        {
          !qrValue && <div>
            <div className="mb-2">
              {t('security.mobile_passwordless.enter_code')}
            </div>
            <Form
              form={form}
              onFinish={handleContinue}
            >
              <Form.Item
                name={'otp'}
                rules={[
                  global.rules.REQUIRED(t('security.mobile_passwordless.code')),
                  global.rules.LATEST_LENGTH(t('security.mobile_passwordless.code'), 6)
                ]}
              >
                <Input
                  autoFocus={true}
                  size="large"
                  placeholder={t('placeholder.enter')}
                  disabled={callingAPI}
                />
              </Form.Item>
              <Button
                className="w-full"
                type="primary"
                htmlType="submit"
                size="large"
                loading={callingAPI}
              >
                {t('button.continue')}
              </Button>
            </Form>
          </div>
        }
        {
          qrValue && <div className="text-center">
            <p className="my-10">{t('security.mobile_passwordless.point_phone')}</p>
            {/* QR code */}
            <QRCode
              size={280}
              level="H"
              value={qrValue}
            />
            <div className="text-center my-6" style={{ color: red[5] }}>
              {
                expireCountdown > 0 ? t('security.mobile_passwordless.expire_in', { expireCountdown }) : t('security.mobile_passwordless.expired')
              }
            </div>
          </div>
        }
      </div>
    </Modal>
  );
}

export default QrCodeModal;