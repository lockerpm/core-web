import React, { useState } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PairingForm, PasswordlessForm } from "../../../../../../components";

const ConfirmModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    action = null,
    callingAPI = false,
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);

  const [isPair, setIsPair] = useState(!service.pairingService?.hasKey)

  return (
    <Modal
      title={action}
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      {
        isPair ? <PairingForm
          callingAPI={callingAPI}
          userInfo={userInfo}
          onConfirm={() => {
            if (userInfo.login_method === 'passwordless') {
              setIsPair(false)
            } else {
              onConfirm()
            }
          }}
        /> : <div>
          <PasswordlessForm
            changing={callingAPI}
            userInfo={userInfo}
            onError={() => setIsPair(true)}
            onConfirm={onConfirm}
          />
        </div>
      }
    </Modal>
  );
}

export default ConfirmModal;