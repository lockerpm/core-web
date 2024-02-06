import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import formsComponents from '../../../../../../components/forms';

import authServices from '../../../../../../services/auth';

import global from '../../../../../../config/global';

const { MailOtp } = formsComponents;

function MailOtpFormData(props) {
  const {
    visible = false,
    factor2 = {},
    onReload = () => { },
    onClose = () => { },
  } = props
  const { t } = useTranslation()
  const userInfo = useSelector(state => state.auth.userInfo)
  const [callingAPI, setCallingAPI] = useState(false);
  const [isSentTo, setIsSentTo] = useState(false);
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('')

  const mailOtp = useMemo(() => {
    return factor2?.mail_otp
  }, [factor2])

  useEffect(() => {
    setCallingAPI(false);
    setIsSentTo(false);
    setStep(0);
    setOtp('')
  }, [visible])


  const handleSave = async () => {
    setCallingAPI(true);
    await authServices.update_factor2({
      method: global.constants.FACTOR2_IDENTITY.MAIL,
      otp: otp
    }).then(() => {
      global.pushSuccess(t('notification.success.factor2.enabled'));
      onReload();
      onClose();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  const handleNext = async () => {
    setCallingAPI(true);
    await authServices.factor2_activate_code({
      method: global.constants.FACTOR2_IDENTITY.MAIL,
    }).then(() => {
      setIsSentTo(true);
      setStep(1);
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('security.two_fa.email_otp.name')}
        placement="right"
        onClose={onClose}
        open={visible}
        width={540}
        footer={
          <Space className='flex items-center justify-end'>
            {
              step === 0 ? <Button
                disabled={callingAPI}
                onClick={onClose}
              >
                {t('button.cancel')}
              </Button> : <Button
                disabled={callingAPI}
                onClick={() => {
                  setStep(0);
                  setOtp(null);
                  setIsSentTo(false)
                }}
              >
                {t('button.back')}
              </Button>
            }
            {
              step === 0 && <Button
                type="primary"
                loading={callingAPI}
                onClick={handleNext}
              >
                {t('button.next')}
              </Button>
            }
            {
              mailOtp?.is_activate && step === 1 && <Button
                type="primary"
                loading={callingAPI}
                disabled={!otp}
                onClick={handleSave}
              >
                {t('button.disable')}
              </Button>
            }
            {
              !mailOtp?.is_activate && step === 1 && <Button
                type="primary"
                loading={callingAPI}
                disabled={!otp}
                onClick={handleSave}
              >
                {t('button.enable')}
              </Button>
            }
          </Space>
        }
      >
        <p className='mb-4'>
          {t('security.two_fa.email_otp.description')}
        </p>
        <MailOtp
          userInfo={userInfo}
          step={step}
          isSentTo={isSentTo}
          callingAPI={callingAPI}
          otp={otp}
          setStep={setStep}
          setOtp={setOtp}
        />
      </Drawer>
    </div>
  );
}

export default MailOtpFormData;
