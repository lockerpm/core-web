import React, { useState } from "react";
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
    onConfirm = () => {},
    onClose = () => {},
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo);
  const isDesktop = useSelector((state) => state.system.isDesktop);

  const [isPair, setIsPair] = useState(!service.pairingService?.hasKey && !isDesktop)
  const [password, setPassword] = useState(null)

  return (
    <Modal
      title={
        userInfo.is_passwordless ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')
      }
      open={visible}
      onCancel={onClose}
      width={360}
      footer={false}
    >
      {
        isPair ? <PairingForm
          userInfo={userInfo}
          isLogin={true}
          onConfirm={() => setIsPair(false)}
        /> : <div>
          {
            password ? <ChangePasswordForm
              changing={changing}
              onSave={(values) => onConfirm({
                password,
                ...values
              })}
            /> : <PasswordlessForm
              changing={changing}
              userInfo={userInfo}
              onError={() => setIsPair(true)}
              onConfirm={(password) => {
                if (userInfo?.login_method === 'passwordless') {
                  setPassword(password);
                } else {
                  onConfirm(password)
                }
              }}
            />
          }
        </div>
      }
    </Modal>
  );
}

export default FormDataModal;