import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import crypto from "crypto-browserify";

import {
  Space,
  Button,
  Drawer,
  Upload,
  message,
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

  const [callingAPI, setCallingAPI] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (visible) {
      setAttachments(item?.attachments || [])
    } else {
      setAttachments([])
    }
  }, [visible, item?.attachments])

  const handleUploadFile = async (newFile, encryptFile) => {
    const res = await attachmentServices.get_upload_form({
      file_name: newFile.fileName,
      metadata: {
        cipher_id: item?.id
      }
    })
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
            ...item.attachments,
          ]
          await editCipher(newAttachments)
        }
      ).catch((error) => {
        global.pushError(error)
      })
    }
  }

  const editCipher = async (newAttachments) => {
    const { data, collectionIds } = await common.getEncCipherForRequest(
      {
        ...item,
        attachments: newAttachments,
      },
      {
        writeableCollections: allCollections.filter((c) => common.isOwner(c)),
        nonWriteableCollections: allCollections.filter((c) => !common.isOwner(c)),
      }
    )
    await cipherServices.update(item.id, { ...data, collectionIds }).then(() => {
      global.pushSuccess(t('notification.success.attachment.uploaded'));
      setAttachments(newAttachments);
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: '*/*',
    beforeUpload: async (file) => {
      // Checking validate file
      if (file.size >= global.constants.MAX_ATTACHMENT_SIZE) {
        message.error(t('attachments.errors.large'));
        return;
      }
      setCallingAPI(true);
      const newFile = {
        id: Date.now(),
        fileName: file.name,
        size: file.size,
        url: null,
        key: key.toString("base64"),
      }
      setAttachments([newFile, ...attachments])
      const key = crypto.randomBytes(32);
      const encryptFile = await attachmentServices.encrypt_file(file, key);
      if (encryptFile) {
        await handleUploadFile(newFile, encryptFile);
      }
      setCallingAPI(false);
    },
  };

  return (
    <div className={className}>
      <Drawer
        className="vault-attachment-form-drawer"
        title={t("attachments.title")}
        placement="right"
        onClose={() => {}}
        open={visible}
        width={600}
        closable={false}
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
            !!item && common.isOwner(item) && <div>
              <Upload.Dragger
                {...uploadProps}
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
                  cipher={item}
                  setAttachments={setAttachments}
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
