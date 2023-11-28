import React, { } from "react";
import {
  Modal,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import { } from "@ant-design/icons";

import { PasswordlessForm } from "../../../../../../components";

const FormDataModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    changing = false,
    onError = () => {},
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo)

  return (
    <Modal
      title={
        userInfo.is_passwordless ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')
      }
      open={visible}
      width={400}
      footer={false}
      onCancel={() => onClose()}
    >
      <PasswordlessForm
        changing={changing}
        onConfirm={onConfirm}
        onError={onError}
        onClose={onClose}
      />
    </Modal>
  );
}

export default FormDataModal;