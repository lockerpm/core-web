import React, { } from 'react';

import { Trans, useTranslation } from "react-i18next";

import {
  Steps,
  Input,
  Collapse
} from '@lockerpm/design';

import QRCode from "react-qr-code";

function SmartOtpForm(props) {
  const {
    className = '',
    callingAPI = false,
    smartOtp = {},
    otp,
    setOtp = () => { }
  } = props
  const { t } = useTranslation();

  return (
    <div className={className}>
      {
        !smartOtp?.is_activate && <div>
          <Steps
            direction="vertical"
            className="steps-2fa"
            items={[1, 2, 3, 4].map((step) => ({
              status: 'process',
              title: <Collapse
                ghost={true}
                expandIconPosition={'end'}
                defaultActiveKey={["1"]}
              >
                <Collapse.Panel
                  header={<p className="font-semibold">
                    {t(`security.two_fa.smart_otp.step${step}.title`)}
                  </p>}
                  key="1"
                >
                  {
                    step !== 2 ? t(`security.two_fa.smart_otp.step${step}.description`) : <Trans
                      i18nKey={`security.two_fa.smart_otp.step${step}.description`}
                      values={{
                        key: smartOtp?.secret,
                      }}
                      components={{
                        key: <b />
                      }}
                    />
                  }
                </Collapse.Panel>
              </Collapse>,
            }))}
          />
          {
            smartOtp?.url && <div className="mb-4">
              <QRCode
                size={200}
                level="H"
                value={smartOtp?.url}
              />
            </div>
          }
        </div>
      }
      <p className="font-semibold">
        {t('security.two_fa.smart_otp.enter_code')}
      </p>
      <Input
        value={otp}
        className="mt-2"
        placeholder={t('placeholder.code')}
        disabled={callingAPI}
        onChange={(e) => setOtp(e.target.value)}
      />
    </div>
  );
}

export default SmartOtpForm;
