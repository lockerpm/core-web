import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
} from '@lockerpm/design';

import { } from "@ant-design/icons";

import formsComponents from "../../../../../../components/forms";

const NewSecurityKeyModal = (props) => {
  const { Pairing, SecurityKey } = formsComponents;
  const { t } = useTranslation()
  const {
    visible = false,
    changing = false,
    onConfirm = () => { },
    onClose = () => { },
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
        isPair && <Pairing
          userInfo={userInfo}
          onConfirm={() => setIsPair(false)}
        />
      }
      {
        !isPair && <SecurityKey
          changing={changing}
          userInfo={userInfo}
          onConfirm={onConfirm}
          onRepair={() => setIsPair(true)}
        />
      }
    </Modal>
  );
}

export default NewSecurityKeyModal;