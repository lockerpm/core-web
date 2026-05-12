import React from "react";
import { useTranslation, Trans } from "react-i18next";

import {
  Modal,
  Button,
} from '@lockerpm/design';

const ConfirmEncryptionUpdateModal = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    callingAPI = false,
    onClose = () => { },
    onConfirm = () => { },
  } = props;

  return (
    <Modal
      title={t('security.encryption_key_settings.confirm_update.title')}
      open={visible}
      closable={!callingAPI}
      onCancel={!callingAPI ? onClose : () => {}}
      width={500}
      footer={false}
    > 
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <p className="text-md">
            <Trans
              i18nKey={'security.encryption_key_settings.confirm_update.description'}
              components={{
                b: <b className="font-semibold"/>
              }}
            />
          </p>
          <p className="text-md">
            {t('security.encryption_key_settings.confirm_update.note')}
          </p>
        </div>
        <Button
          className="w-full"
          type="primary"
          size="large"
          loading={callingAPI}
          onClick={onConfirm}
        >
          {t('security.encryption_key_settings.confirm_update.action')}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmEncryptionUpdateModal;