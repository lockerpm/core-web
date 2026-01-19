import React from 'react';
import { useTranslation } from "react-i18next";

import {
  Button,
  Input
} from '@lockerpm/design';

import {
  MailOutlined
} from '@ant-design/icons';

function MailOtpForm(props) {
  const {
    className = '',
    userInfo,
    step,
    isSentTo,
    callingAPI,
    otp,
    setStep = () => { },
    setOtp = () => { },
  } = props
  const { t } = useTranslation();

  return (
    <div className={className}>
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
            isSentTo && <p className="mb-4">
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
    </div>
  );
}

export default MailOtpForm;
