import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Space,
  Button,
  Drawer,
  Input,
  Steps,
  Collapse
} from '@lockerpm/design';

import QRCode from "react-qr-code";

import {
} from '@ant-design/icons';

import { } from 'react-redux';
import { Trans, useTranslation } from "react-i18next";

import authServices from '../../../../../../services/auth';
import global from '../../../../../../config/global';

function SmartOtpFormData(props) {
  const {
    visible = false,
    factor2 = {},
    onReload = () => {},
    onClose = () => {},
  } = props
  const { t } = useTranslation()

  const [callingAPI, setCallingAPI] = useState(false);
  const [otp, setOtp] = useState('')

  const smartOtp = useMemo(() => {
    return factor2?.smart_otp
  }, [factor2])

  useEffect(() => {
    setCallingAPI(false);
    setOtp('')
  }, [visible])


  const handleSave = async () => {
    setCallingAPI(true);
    await authServices.update_factor2({
      method: global.constants.FACTOR2_IDENTITY.SMART_OTP,
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


  return (
    <div className={props.className}>
      <Drawer
        title={t('security.two_fa.smart_otp.name')}
        placement="right"
        onClose={onClose}
        open={visible}
        width={540}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.cancel')}
            </Button>
            {
              smartOtp?.is_activate && <Button
                type="primary"
                loading={callingAPI}
                disabled={!otp}
                onClick={handleSave}
              >
                { t('button.disable') } 
              </Button>
            }
            {
              !smartOtp?.is_activate && <Button
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
          {t('security.two_fa.smart_otp.description')}
        </p>
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
                          key: <b/>
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
      </Drawer>
    </div>
  );
}

export default SmartOtpFormData;
