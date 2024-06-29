import React, { } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
} from '@lockerpm/design';

import { } from '@ant-design/colors';

import { } from "@ant-design/icons";

import formsComponents from "../../../../../../components/forms";

const NewPasskeyModal = (props) => {
  const { Passkey } = formsComponents;
  const { t } = useTranslation()
  const {
    visible = false,
    changing = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);

  return (
    <Modal
      title={t('security.passkey.add_new_key')}
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      <Passkey
        changing={changing}
        isAddKey={true}
        userInfo={userInfo}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}

export default NewPasskeyModal;