import React, { useMemo, useEffect, useState } from "react";
import {
  Upload,
  message,
  Button
} from '@lockerpm/design';
import {
  InboxOutlined,
  CloseOutlined
} from "@ant-design/icons";

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

const UploadAvatar = (props) => {
  const {
    value,
    onChange = () => {},
    onChangeFile = () => {}
  } = props
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [imageSize, setImageSize] = useState({});
  const [imageUrl, setImageUrl] = useState(value);

  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const previewStyle = useMemo(() => {
    if (imageSize.width > imageSize.height) {
      return {
        width: imageSize.width,
        maxWidth: '100%',
        height: 'auto',
        maxHeight: '100%',
      }
    }
    return {
      height: imageSize.height,
      maxHeight: '100%',
      width: 'auto',
      maxWidth: '100%',
    }
  }, [imageSize])

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: async (file) => {
      const fileType = file.type;
      const isJpgOrPng = fileType.includes('image');

      if (!isJpgOrPng) {
        message.error(t('drag_upload.invalid'));
      }
      onChangeFile(file)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          if (this.height * this.width > 800 * 400) {
            message.error(t('drag_upload.large'));
            return false;
          } else {
            setImageSize({
              width: this.width,
              height: this.height
            })
            setImageUrl(e.target.result);
            onChange(e.target.result)
          }
          return true;
        };
      };
    },
  };

  return (
    <div
      className="upload-avatar"
    >
      <Upload.Dragger {...uploadProps}>
        <div
          style={{ height: 160 }}
          className="flex items-center justify-center"
        >
          {imageUrl ? <img
            src={imageUrl}
            alt="avatar"
            style={previewStyle}
          /> : <div>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              <span className="text-primary font-semibold mr-1">
                {t('drag_upload.action')}
              </span>
              <span>
                {t('drag_upload.description')}
              </span>
            </p>
            <p className="ant-upload-hint">
              {t('drag_upload.note')}
            </p>
          </div>}
        </div>
      </Upload.Dragger>
      {
        imageUrl && <div
          className="flex justify-end"
          style={{
            zIndex: 1000,
            position: 'absolute',
            top: 0,
            right: 0
          }}
        >
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => {
              setImageUrl(null);
              onChange(null)
            }}
          >
          </Button>
        </div>
      }
    </div>
  );
}

export default UploadAvatar;