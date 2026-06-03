import React from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
  Button,
} from '@lockerpm/design';

import {
  ArrowRightOutlined
} from "@ant-design/icons";

import itemsComponents from "../items";

import common from "../../utils/common";

const EncryptionUpdateModal = (props) => {
  const { RouterLink } = itemsComponents;
  const { t } = useTranslation()
  const {
    visible = false,
    onClose = () => { },
  } = props;

  return (
    <Modal
      title={<div className="px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 uppercase w-max text-xs">
        {t('security.encryption_key_settings.update_now.tag')}
      </div>}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={false}
    > 
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {t('security.encryption_key_settings.update_now.title')}
          </h2>
          <p className="text-md">
            {t('security.encryption_key_settings.update_now.description')}
          </p>
          <RouterLink
            className={'font-semibold'}
            label={t('security.encryption_key_settings.update_now.learn_more')}
            icon={<ArrowRightOutlined />}
            onClick={() => {}}
          />
        </div>
        <Button
          className="w-full"
          type="primary"
          size="large"
          onClick={() => {
            common.encryptionUpdateNow();
            onClose();
          }}
        >
          {t('security.encryption_key_settings.update_now.action')}
        </Button>
      </div>
    </Modal>
  );
}

export default EncryptionUpdateModal;