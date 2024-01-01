import React, { useEffect, useState } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PairingForm, PasswordlessForm, ChangePasswordForm } from "../../../../../../components";

const FormDataModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    changing = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);
  const isDesktop = useSelector((state) => state.system.isDesktop);
  const isConnected = useSelector((state) => state.service.isConnected);

  const [isPair, setIsPair] = useState(false)
  const [password, setPassword] = useState(null)

  useEffect(() => {
    setIsPair(!isConnected || (!service.pairingService?.hasKey && !isDesktop))
  }, [isConnected, isDesktop])


  return (
    <Modal
      title={
        userInfo.password_method === 'passwordless' ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')
      }
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      {
        isPair && <PairingForm
          userInfo={userInfo}
          isLogin={true}
          onConfirm={() => setIsPair(false)}
        />
      }
      {
        !isPair && !password && <PasswordlessForm
          changing={changing}
          userInfo={userInfo}
          onRepair={() => setIsPair(true)}
          onConfirm={(password) => {
            if (userInfo?.login_method === 'passwordless') {
              setPassword(password);
            } else {
              onConfirm(password)
            }
          }}
        />
      }
      {
        !isPair && password && <ChangePasswordForm
          changing={changing}
          onSave={(values) => onConfirm({
            password,
            ...values
          })}
        />
      }
    </Modal>
  );
}

export default FormDataModal;