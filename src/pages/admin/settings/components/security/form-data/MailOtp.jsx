import React, { useMemo, useState, useEffect } from 'react';
import {
  Space,
  Button,
  Drawer,
  Input,
} from '@lockerpm/design';

import {
  MailOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import authServices from '../../../../../../services/auth';
import global from '../../../../../../config/global';

function MailOtpFormData(props) {
  const {
    visible = false,
    factor2 = {},
    onReload = () => {},
    onClose = () => {},
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
                { t('button.next') } 
              </Button>
            }
            {
              mailOtp?.is_activate && step === 1 && <Button
                type="primary"
                loading={callingAPI}
                disabled={!otp}
                onClick={handleSave}
              >
                { t('button.disable') } 
              </Button>
            }
            {
              !mailOtp?.is_activate && step === 1 && <Button
                type="primary"
                loading={callingAPI}
                disabled={!otp}
                onClick={handleSave}
              >
                { t('button.enable') } 
              </Button>
            }
          </Space>
        }
      >
        <p className='mb-4'>
          {t('security.two_fa.email_otp.description')}
        </p>
        {
          step === 0 && <div>
            <div className='flex items-center font-semibold justify-between'>
              <div className='flex items-center'>
                <MailOutlined />
                <span className='ml-2'>
                  {t('security.two_fa.email_otp.send_code')}
                </span>
              </div>
              <Button size="small" onClick={() => setStep(1)}>
                {t('security.two_fa.email_otp.have_code')}
              </Button>
            </div>
            <p className='mt-2 text-primary'>
              {userInfo?.email}
            </p>
          </div>
        }
        {
          step === 1 && <div>
            {
              isSentTo &&  <p className="mb-4">
                {t('security.two_fa.email_otp.sent_to', { email: userInfo.email })}
              </p>
            }
            <p className="font-semibold">
              {t('security.two_fa.email_otp.enter_code')}
            </p>
            <Input
              value={otp}
              className="mt-2"
              placeholder={t('placeholder.code')}
              disabled={callingAPI}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        }
      </Drawer>
    </div>
  );
}

export default MailOtpFormData;