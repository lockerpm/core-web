import React, { useState, useMemo, useEffect } from "react";
import './css/upload-file.scss';
import {
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  Upload,
  message
} from '@lockerpm/design'

function UploadFile(props) {
  const {
    value = '',
    disabled = false,
    onChange = () => {},
    setLogoFile = () => {}
  } = props
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);
  const [imageSize, setImageSize] = useState({});

  useEffect(() => {
    if (value) {
      setImageUrl(value)
    }
  }, [value])

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = function() {
        setImageSize({
          width: this.width,
          height: this.height
        })
        setLoading(false);
      }
      img.src = imageUrl;
    }
  }, [imageUrl])

  const previewStyle = useMemo(() => {
    if (imageSize.width > imageSize.height) {
      return {
        width: '95%',
        height: 'auto',
        maxHeight: '95%',
      }
    }
    return {
      height: '95%',
      width: 'auto',
      maxWidth: '95%',
    }
  }, [imageSize])

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }
    setLogoFile(file)
    return true;
  };

  const changeFile = async (info) => {
    setLoading(true);
    try {
      getBase64(info.file.originFileObj, (url) => {
        setImageUrl(url);
        onChange(url);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div
      className="upload-file"
    >
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        disabled={disabled}
        beforeUpload={beforeUpload}
        onChange={changeFile}
      >
        {imageUrl ? <img
          src={imageUrl}
          alt="avatar"
          style={previewStyle}
        /> : uploadButton}
      </Upload>
    </div>
  )
}

export default UploadFile;