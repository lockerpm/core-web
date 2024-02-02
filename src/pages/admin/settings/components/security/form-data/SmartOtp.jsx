import React, { useMemo, useState, useEffect } from 'react';
import { } from 'react-redux';
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

const { SmartOtp } = formsComponents;

function SmartOtpFormData(props) {
  const {
    visible = false,
    factor2 = {},
    onReload = () => { },
    onClose = () => { },
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
                {t('button.disable')}
              </Button>
            }
            {
              !smartOtp?.is_activate && <Button
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
          {t('security.two_fa.smart_otp.description')}
        </p>
        <SmartOtp
          callingAPI={callingAPI}
          smartOtp={smartOtp}
          otp={otp}
          setOtp={setOtp}
        />
      </Drawer>
    </div>
  );
}

export default SmartOtpFormData;
