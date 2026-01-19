import React from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
} from '@lockerpm/design';

import itemsComponents from "../../../../../components/items";

const ConfirmRestoreModal = (props) => {
  const { TextCopy } = itemsComponents;
  const { t } = useTranslation()
  const {
    visible = false,
    item = {},
    callingAPI = false,
    onConfirm = () => { },
    onClose = () => { },
  } = props;

  return (
    <Modal
      title={t('password_history.restore_password')}
      open={visible}
      onCancel={onClose}
      width={360}
      okText={t('button.restore')}
      okButtonProps={{
        loading: callingAPI,
      }}
      cancelButtonProps={{
        disabled: callingAPI
      }}
      onOk={() => onConfirm()}
    >
      <div>
        <div className="mb-6">
          {t('password_history.question')}
        </div>
        <div className="flex items-center justify-center mb-6">
          <TextCopy
            value={item?.password || ''}
            showIcon={false}
            show={false}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmRestoreModal;