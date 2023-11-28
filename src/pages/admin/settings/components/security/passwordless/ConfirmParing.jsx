import React, { useState, useEffect } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PairingForm } from "../../../../../../components";

const ConfirmParingModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  return (
    <Modal
      title={t('passwordless.confirm_pairing')}
      open={visible}
      width={400}
      footer={false}
      onCancel={() => onClose()}
    >
      <PairingForm
        onConfirm={onConfirm}
      />
    </Modal>
  );
}

export default ConfirmParingModal;