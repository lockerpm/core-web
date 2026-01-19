import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

import {
  Space,
  Button,
  Drawer,
} from '@lockerpm/design';

import cipherFormItemComponents from '../../../../components/cipher/form-item';

function FormAttachment(props) {
  const { t } = useTranslation();
  const { Attachments } = cipherFormItemComponents;

  const {
    className = '',
    visible = false,
    item = null,
    onClose = () => {},
  } = props;

  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [callingAPI, setCallingAPI] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === item?.id)
  }, [allCiphers, item])

  useEffect(() => {
    if (visible) {
      setAttachments(originCipher?.attachments || [])
    } else {
      setAttachments([])
    }
  }, [visible, originCipher])

  const isUploading = useMemo(() => {
    return !!attachments.find((attach) => !attach.url)
  }, [attachments])

  return (
    <div className={className}>
      <Drawer
        className="vault-attachment-form-drawer"
        title={t("attachments.title")}
        placement="right"
        onClose={isUploading ? () => {} : onClose}
        open={visible}
        width={600}
        closable={!isUploading}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              className="vault-attachment-form-close-btn"
              disabled={callingAPI}
              onClick={onClose}
            >
              {t('button.close')}
            </Button>
          </Space>
        }
      >
        <Attachments
          originCipher={originCipher}
          isUploading={isUploading}
          isCipherForm={false}
          callingAPI={callingAPI}
          attachments={attachments}
          setCallingAPI={setCallingAPI}
          setAttachments={setAttachments}
        />
      </Drawer>
    </div>
  );
}

export default FormAttachment;
