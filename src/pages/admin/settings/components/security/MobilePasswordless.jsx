import React, { useState } from "react";
import {
  Button,
  Tooltip,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components';

import QrCodeModal from "./mobile-passwordless/QrCode";

import {
  QrcodeOutlined,
} from "@ant-design/icons";

const MobilePasswordless = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo)
  
  const [formVisible, setFormVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.mobile_passwordless.title')}
        </p>
        <Tooltip
          title={userInfo.login_method === 'passwordless' ? '' : t('security.mobile_passwordless.passwordless_disabled')}
        >
          <Button
            type='primary'
            ghost
            icon={<QrcodeOutlined />}
            disabled={userInfo.login_method !== 'passwordless'}
            onClick={() => setConfirmVisible(true)}
          >
            {t('security.mobile_passwordless.action')}
          </Button>
        </Tooltip>
      </div>
      <p className="mt-1">
        {t('security.mobile_passwordless.description')}
      </p>
      <PasswordConfirmModal
        title={t('security.mobile_passwordless.action')}
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          setFormVisible(true)
        }}
      />
      {
        formVisible && <QrCodeModal
          visible={formVisible}
          onClose={() => setFormVisible(false)}
        />
      }
    </div>
  );
}

export default MobilePasswordless;
