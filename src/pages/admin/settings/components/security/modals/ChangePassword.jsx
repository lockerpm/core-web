import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Modal,
} from '@lockerpm/design';

import { } from '@ant-design/colors';

import { } from "@ant-design/icons";

import formsComponents from "../../../../../../components/forms";

import userServices from '../../../../../../services/user';
import authServices from '../../../../../../services/auth';

import global from "../../../../../../config/global";

const { ChangePassword } = formsComponents;

const ChangePasswordModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    currentPassword = null,
    onClose = () => { },
  } = props;
  
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [callingAPI, setCallingAPI] = useState(false);

  const handleSave = async (values) => {
    setCallingAPI(true);
    await userServices.change_password({
      username: userInfo.email,
      password: currentPassword,
      login_method: 'password',
      ...values,
    }).then(async () => {
      global.pushSuccess(t('notification.success.change_password.changed'));
      onClose();
      authServices.logout();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <Modal
      title={t('change_password.title')}
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      <ChangePassword
        changing={callingAPI}
        isReset={false}
        onSave={(values) => handleSave(values)}
      />
    </Modal>
  );
}

export default ChangePasswordModal;