import React, { useState } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import components from "../../../../../../components";

const NewKeyModal = (props) => {
  const { Pairing, SecurityKey } = components;
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
          isLogin={true}
          onConfirm={() => setIsPair(false)}
        />
      }
      {
        !isPair && <SecurityKey
          changing={changing}
          userInfo={userInfo}
          isAddKey={true}
          onConfirm={onConfirm}
          onRepair={() => setIsPair(true)}
        />
      }
    </Modal>
  );
}

export default NewKeyModal;