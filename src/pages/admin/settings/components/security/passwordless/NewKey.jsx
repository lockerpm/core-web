import React, { useState } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PairingForm, PasswordlessForm } from "../../../../../../components";

const NewKeyModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    changing = false,
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);

  const [isPair, setIsPair] = useState(!service.pairingService?.hasKey)

  return (
    <Modal
      title={t('security.passwordless.add_new_key')}
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      {
        isPair ? <PairingForm
          isLogin={true}
          onConfirm={() => setIsPair(false)}
        /> : <div>
          <PasswordlessForm
            changing={changing}
            userInfo={userInfo}
            isAddKey={true}
            onError={() => setIsPair(true)}
            onConfirm={onConfirm}
          />
        </div>
      }
    </Modal>
  );
}

export default NewKeyModal;