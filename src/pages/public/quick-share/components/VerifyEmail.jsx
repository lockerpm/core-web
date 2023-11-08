import React, { useState } from "react";
import {
  Form,
  Input,
  Button
} from '@lockerpm/design';

import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import { ImageIcon } from "../../../../components";

import {
  RedoOutlined
} from "@ant-design/icons";
import global from "../../../../config/global";
import common from "../../../../utils/common";
import quickShareServices from "../../../../services/quick-share";

const VerifyEmail = (props) => {
  const {
    sendId,
    decryptKey,
    setCipher = () => {},
    submitToken = () => {},
    setRequireOtp = () => {}
  } = props;
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale)

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const email = Form.useWatch('email', form);
  const otp = Form.useWatch('otp', form);

  const submitEmail = () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      const token = common.getToken(email);
      if (token) {
        const isSuccess = await submitToken(token, email)
        if (!isSuccess) {
          sendOTP()
        }
      } else {
        sendOTP()
      }
      setCallingAPI(false);
    })
  }

  const sendOTP = async (isRetry = false) => {
    try {
      // Check permission first (will not be throttled)
      await quickShareServices.check_access(sendId, { email })

      // Send otp (throttled + captcha)
      await quickShareServices.send_otp(sendId, { email, language: locale });

      setShowOtp(true)

      if (isRetry) {
        global.pushSuccess(t('notification.success.quick_share_detail.check_mail'))
      }
    } catch (error) {
      global.pushError(error)
    }
  }

  const submitOTP = () => {
    form.validateFields().then(async () => {
      setCallingAPI(true);
      await quickShareServices.submit(sendId, {email, code: otp}).then(async (res) => {
        const cipher = await common.decryptCipher(res.cipher, decryptKey);
        setCipher(cipher);
        setShowOtp(false);
        setRequireOtp(false);
        if (res.token) {
          localStorage.setItem(`token_${email}`, JSON.stringify(res.token))
        }
      }).catch((error) => {
        global.pushError(error)
      })
      setCallingAPI(false);
    })
  }

  return (
    <div>
      <div className="text-center">
        <ImageIcon
          name={'any-icon'}
          width={48}
          height={48}
        />
      </div>
      <p className="my-6 font-semibold text-2xl text-center">
        {t('quick_share_detail.verify_email.title')}
      </p>
      <p className="mb-2">
        { showOtp ? t('quick_share_detail.verify_email.enter_otp') : t('quick_share_detail.verify_email.description')}
      </p>
      <Form form={form} className="mt-4">
        <Form.Item
          name={'email'}
          rules={[
            global.rules.REQUIRED(t('common.email')),
            global.rules.INVALID(t('common.email', 'EMAIL'))
          ]}
        >
          <Input
            disabled={callingAPI}
            placeholder={t('placeholder.email')}
            size="large"
            onChange={() => {
              setShowOtp(false)
            }}
          />
        </Form.Item>
        {
          showOtp && <Form.Item
            name={'otp'}
            rules={[
              global.rules.REQUIRED(t('common.otp_code')),
            ]}
          >
            <Input
              disabled={callingAPI}
              placeholder={t('placeholder.otp')}
              size="large"
            />
          </Form.Item>
        }
        {
          showOtp ? <div>
            <Button
              className={"mt-4 w-full"}
              type="primary"
              size="large"
              loading={callingAPI}
              onClick={submitOTP}
            >
              {t('button.verify')}
            </Button>
            <p
              className="font-semibold mt-4 text-center"
              onClick={() => sendOTP(true)}
            >
              <RedoOutlined />
              <span className="ml-2">
                {t('quick_share_detail.verify_email.resend')}
              </span>
            </p>
          </div> : <Button
            className={"mt-4 w-full"}
            type="primary"
            size="large"
            loading={callingAPI}
            onClick={submitEmail}
          >
            {t('quick_share_detail.verify_email.action')}
          </Button>
        }
      </Form>
    </div>
  );
}

export default VerifyEmail;