import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  ArrowLeftOutlined,
} from "@ant-design/icons";

import commonServices from "../../../../services/common";

const UnlockTitle = (props) => {
  const { t } = useTranslation();

  const {
    step,
    otherMethod,
    showMpForm = true,
    callingAPI = false,
    setStep = () => {},
    setIsPair = () => {},
    setOtherMethod = () => {},
  } = props;

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isTouch = useSelector(state => state.service.isTouch);
  const isFingerprint = useSelector(state => state.service.isFingerprint);

  const description = useMemo(() => {
    if (userInfo?.sync_all_platforms) {
      return t('lock.cross_platform_sync_enable')
    }
    if (otherMethod === 'security_key') {
      return t('lock.security_key_desc');
    }
    if (otherMethod === 'passkey') {
      return t('lock.passkey_key_desc');
    }
    if (showMpForm) {
      return t('lock.description');
    }
    return t('lock.pwl_required')
  }, [userInfo, otherMethod, showMpForm])

  return (
    <div className="text-center">
      <div className="w-full flex items-center justify-center">
        {
          step > 1 && !(callingAPI || isTouch || isFingerprint) && <Button
            className="mr-2"
            type={'text'}
            icon={<ArrowLeftOutlined />}
            onClick={async () => {
              await commonServices.reset_service();
              setStep(step - 1);
              setIsPair(false);
              setOtherMethod('password');
            }}
          />
        }
        <p className="text-2xl font-semibold">
          {t('lock.title')}
        </p>
      </div>
      <p className="mb-6 mt-2 text-center">
        {description}
      </p>
    </div>
  );
}

export default UnlockTitle;