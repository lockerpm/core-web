import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import crypto from "crypto-browserify";

import {
  Upload,
  Card
} from '@lockerpm/design';

import {
  CloudUploadOutlined
} from '@ant-design/icons';

import itemsComponents from '../../items';

import cipherServices from '../../../services/cipher';
import attachmentServices from '../../../services/attachment';

import global from '../../../config/global';
import common from '../../../utils/common';

function Attachments(props) {
  const { t } = useTranslation();
  const {
    Attachment
  } = itemsComponents;

  const {
    className = '',
    isUpload = false,
    originCipher = null,
    isUploading = false,
    isCipherForm = false,
    callingAPI = false,
    attachments = [],
    setCallingAPI = () => {},
    setAttachments = () => {},
    uploaded = () => {},
  } = props;

  const allCollections = useSelector((state) => state.collection.allCollections);

  const [newFile, setNewFile] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    if (isUpload && originCipher && newFile && fileKey && fileUpload) {
      handleEncryptAndUpload(newFile, fileUpload, fileKey)
    }
  }, [
    isUpload,
    newFile,
    fileKey,
    fileUpload
  ])
  
  const editCipher = async (newAttachments) => {
    const passwordStrength = originCipher.login?.password ? common.getPasswordStrength(originCipher.login?.password) : {};
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
    await cipherServices.update(originCipher.id, {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }).then(() => {
      global.pushSuccess(t('notification.success.attachment.uploaded'));
    }).catch((error) => {
      setAttachments(originCipher?.attachments || [])
      const { code } = common.getErrorMessage(error)
      if (code === "0004") {
        global.pushError({ message: t('notification.error.attachment.file_name') })
      } else {
        global.pushError(error);
      }
    })
  }

  const integratingUploadFile = async (newFile, encryptFile) => {
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

  const handleEncryptAndUpload = async (newFile, file, key) => {
    setCallingAPI(true);
    const encryptFile = await attachmentServices.encrypt_file(file, key);
    if (encryptFile) {
      await integratingUploadFile(newFile, encryptFile);
    } else {
      global.notification('error', t('notification.error.title'), t('drag_upload.invalid'))
    }
    setCallingAPI(false);
    uploaded();
  }

  const uploadProps = useMemo(() => {
    return {
      name: 'file',
      showUploadList: false,
      accept: '*/*',
      beforeUpload: async (file) => {
        // Checking validate file
        if (!common.checkingHandleAttachment()) {
          return;
        }
        if (file.size >= global.constants.MAX_ATTACHMENT_SIZE) {
          global.notification('error', t('notification.error.title'), t('attachments.errors.large'))
          return;
        }
        const key = crypto.randomBytes(32);
        const newFile = {
          id: Date.now(),
          fileName: file.name,
          size: file.size,
          url: null,
          key: key.toString("base64"),
        }
        setAttachments([newFile, ...attachments]);
        if (!isCipherForm) {
          handleEncryptAndUpload(newFile, file, key);
        } else {
          setNewFile(newFile);
          setFileKey(key);
          setFileUpload(file);
        }
      },
    }
  }, [
    attachments,
    originCipher,
    isCipherForm,
    handleEncryptAndUpload
  ]);

  const showUploadButton = useMemo(() => {
    if (!originCipher) {
      return true
    }
    return common.isOwner(originCipher)
  }, [originCipher])

  const deleteAttachment = (attachment) => {
    setAttachments(attachments?.filter((attach) => attach.id !== attachment?.id))
  }

  return (
    <div
      className={`flex flex-col gap-6 ${className}`}
    >
      {
        showUploadButton && <div>
          <Upload.Dragger
            {...uploadProps}
            disabled={isUploading || callingAPI}
            style={{
              borderRadius: isCipherForm ? 6 : 12
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
      {
        attachments.length > 0 && <div className='flex flex-col gap-3'>
          {
            attachments.map((attachment, index) => (
              <Attachment
                key={index}
                attachment={attachment}
                cipher={originCipher}
                isCipherForm={isCipherForm}
                callingAPI={callingAPI}
                onDelete={() => deleteAttachment(attachment)}
              />
            ))
          }
        </div>
      }
    </div>
  );
}

export default Attachments;
