import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import crypto from "crypto-browserify";

import {
  Space,
  Button,
  Drawer,
  Upload,
  Card
} from '@lockerpm/design';

import {
  CloudUploadOutlined
} from '@ant-design/icons';

import itemsComponents from '../../../../components/items';

import cipherServices from '../../../../services/cipher';
import attachmentServices from '../../../../services/attachment';

import global from '../../../../config/global';
import common from '../../../../utils/common';

function FormAttachment(props) {
  const { t } = useTranslation();
  const {
    Attachment
  } = itemsComponents;

  const {
    className = '',
    visible = false,
    item = null,
    onClose = () => {},
  } = props;

  const allCollections = useSelector((state) => state.collection.allCollections)
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [callingAPI, setCallingAPI] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === item?.id)
  }, [allCiphers, item])

  const isUploading = useMemo(() => {
    return !!attachments.find((attach) => !attach.url)
  }, [attachments])

  useEffect(() => {
    if (visible) {
      setAttachments(originCipher?.attachments || [])
    } else {
      setAttachments([])
    }
  }, [visible, originCipher])

  const handleUploadFile = async (newFile, encryptFile) => {
    await attachmentServices.get_upload_form({
      file_name: newFile.fileName,
      metadata: {
        cipher_id: originCipher?.id
      }
    }).then(async (res) => {
      if (res?.upload_form) {
        const uploadId = res.upload_id;
        const fileSizeEnc = common.getFileSizeFromBase64(encryptFile);
        await attachmentServices.upload_file(res?.upload_form?.url, encryptFile)
          .then(async () => {
            const newAttachments = [
              {
                ...newFile,
                size: fileSizeEnc,
                url: uploadId
              },
              ...originCipher.attachments,
            ]
            await editCipher(newAttachments)
          }
        ).catch((error) => {
          setAttachments(originCipher?.attachments || [])
          global.pushError(error)
        })
      }
    }).catch((error) => {
      setAttachments(originCipher?.attachments || [])
      global.pushError(error)
    })
  }

  const editCipher = async (newAttachments) => {
    const { data, collectionIds } = await common.getEncCipherForRequest(
      {
        ...originCipher,
        attachments: newAttachments,
      },
      {
        writeableCollections: allCollections.filter((c) => common.isOwner(c)),
        nonWriteableCollections: allCollections.filter((c) => !common.isOwner(c)),
      }
    )
    await cipherServices.update(originCipher.id, { ...data, collectionIds }).then(() => {
      global.pushSuccess(t('notification.success.attachment.uploaded'));
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const uploadProps = useMemo(() => {
    return {
      name: 'file',
      showUploadList: false,
      accept: '*/*',
      beforeUpload: async (file) => {
        // Checking validate file
        if (file.size >= global.constants.MAX_ATTACHMENT_SIZE) {
          global.notification('error', t('notification.error.title'), t('attachments.errors.large'))
          return;
        }
        setCallingAPI(true);
        const key = crypto.randomBytes(32);
        const newFile = {
          id: Date.now(),
          fileName: file.name,
          size: file.size,
          url: null,
          key: key.toString("base64"),
        }
        setAttachments([newFile, ...attachments])
        const encryptFile = await attachmentServices.encrypt_file(file, key);
        if (encryptFile) {
          await handleUploadFile(newFile, encryptFile);
        }
        setCallingAPI(false);
      },
    }
  }, [
    attachments,
    originCipher,
    handleUploadFile
  ]);

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
        <div className='flex flex-col gap-6'>
          {
            !!originCipher && common.isChangeAttachment(originCipher) && <div>
              <Upload.Dragger
                {...uploadProps}
                disabled={isUploading}
                style={{
                  borderRadius: 12
                }}
              >
                <div
                  className="flex items-center justify-center flex-col gap-2"
                >
                  <Card
                    bodyStyle={{
                      padding: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    style={{ width: 40, height: 40 }}
                    className='rounded-md'
                  >
                    <CloudUploadOutlined className='text-[20px]'/>
                  </Card>
                  <p className="ant-upload-text" style={{ marginBottom: 0 }}>
                    <span className="text-primary font-semibold">
                      {t("attachments.upload.title")}
                    </span>
                  </p>
                  <p className="text-black-500">
                    {t("attachments.upload.description")}
                  </p>
                </div>
              </Upload.Dragger>
            </div>
          }
          <div className='flex flex-col gap-3'>
            {
              attachments.map((attachment, index) => (
                <Attachment
                  key={index}
                  attachment={attachment}
                  cipher={originCipher}
                />
              ))
            }
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default FormAttachment;
