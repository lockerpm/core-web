import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  KeyOutlined,
} from "@ant-design/icons";

import modalsComponents from "../../../../../components/modals";
import securityModalsComponents from "./modals";

const ChangePassword = (props) => {
  const { PasswordConfirmModal } = modalsComponents;
  const { ChangePasswordModal } = securityModalsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);

  const userInfo = useSelector(state => state.auth.userInfo);
  const isMobile = useSelector(state => state.system.isMobile);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.change_password.title')}
        </p>
        <Button
          type='primary'
          ghost
          disabled={userInfo.is_require_passwordless}
          icon={<KeyOutlined />}
          onClick={() => setConfirmVisible(true)}
        >
          {isMobile ? '' : t('change_password.title')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.change_password.description')}
      </p>
      <PasswordConfirmModal
        visible={confirmVisible}
        title={t('change_password.title')}
        okText={t('button.confirm')}
        onConfirm={(password) => {
          setCurrentPassword(password);
          setConfirmVisible(false);
          setFormVisible(true)
        }}
        onClose={() => setConfirmVisible(false)}
      />
      <ChangePasswordModal
        visible={formVisible}
        currentPassword={currentPassword}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default ChangePassword;
