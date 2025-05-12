import React, { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
} from '@lockerpm/design';

import {
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined,
  LoadingOutlined
} from "@ant-design/icons";

import attachmentServices from "../../services/attachment";
import cipherServices from '../../services/cipher';
import global from "../../config/global";
import common from "../../utils/common";

const Attachment = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    cipher = {},
    attachment = null,
    isCipherForm = false,
    callingAPI = false,
    onDelete = () => {}
  } = props;

  const allCollections = useSelector((state) => state.collection.allCollections);

  const [downloading, setDownloading] = useState(false);

  const loading = useMemo(() => {
    if (isCipherForm) {
      return callingAPI && !attachment?.url;
    }
    return !attachment?.url
  }, [attachment, isCipherForm, callingAPI])

  const isDownload = useMemo(() => {
    return !!attachment?.url && (!isCipherForm || !!cipher)
  }, [attachment, isCipherForm, cipher])

  const isDelete = useMemo(() => {
    if (!attachment?.url) {
      return true
    }
    return !!cipher && common.isOwner(cipher)
  }, [cipher]);

  const deleteAttachment = () => {
    if (!attachment?.url) {
      onDelete();
    } else {
      global.confirm(async () => {
        await attachmentServices.remove({ paths: [attachment?.url] }).then(async () => {
          await editCipher();
        }).catch((error) => {
          global.pushError(error)
        });
      }, {
        title: t('common.warning'),
        content: t('attachments.delete_question'),
        okText: t('button.ok'),
        okButtonProps: { danger: false },
      });
    }
  };

  const editCipher = async () => {
    const newAttachments = cipher?.attachments?.filter((attach) => attach.id !== attachment?.id);
    const { data, collectionIds } = await common.getEncCipherForRequest(
      {
        ...cipher,
        attachments: newAttachments
      },
      {
        writeableCollections: allCollections.filter((c) => common.isOwner(c)),
        nonWriteableCollections: allCollections.filter((c) => !common.isOwner(c)),
      }
    )
    await cipherServices.update(cipher.id, { ...data, collectionIds }).then(() => {
      global.pushSuccess(t('notification.success.attachment.deleted'));
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const downloadAttachment = async () => {
    if (downloading || !common.checkingHandleAttachment()) {
      return;
    }
    setDownloading(true);
    attachmentServices.get_file_url(attachment?.url).then(async (res) => {
      const fileRes = await fetch(res.url);
      const blob = await fileRes.blob();
      const key = Buffer.from(attachment.key, "base64");
      const fileDecrypted = await attachmentServices.decrypt_file(blob, key);
      common.downloadBase64(fileDecrypted, attachment.fileName);
      global.pushSuccess(t('notification.success.attachment.downloaded'))
    }).catch((error) => {
      global.pushError(error)
    }).finally(() => {
      setDownloading(false)
    })
  }

  return (
    <Card className={`${className} rounded-xl`} bodyStyle={{ padding: 16 }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" style={{ width: 'calc(100% - 48px)' }}>
          <div>
            <FileTextOutlined className="text-primary font-bold text-[36px]"/>
          </div>
          <div className="flex flex-col" style={{ width: 'calc(100% - 44px)' }}>
            <p className="font-semibold text-limited text-limited__block text-black-500">
              {attachment.fileName}
            </p>
            <p className="text-black-500">
              {common.formatFileSizeIntl(attachment.size)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {
            loading && <span className="font-semibold text-primary">
              <LoadingOutlined className="text-[32px]"/>
            </span>
          }
          {
            !loading && <>
              <span className="font-semibold cursor-pointer text-black-500" onClick={downloadAttachment}>
                { downloading ? <LoadingOutlined className="text-[16px]"/> : <>
                  {
                    isDownload && <DownloadOutlined className="text-[16px]" />
                  }
                </> }
              </span>
              {
                isDelete && <span className="font-semibold cursor-pointer text-danger" onClick={deleteAttachment}>
                  <DeleteOutlined className="text-[16px]"/>
                </span>
              }
            </>
          }
        </div>
      </div>
    </Card>
  );
}

export default Attachment;