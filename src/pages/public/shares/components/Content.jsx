import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button
} from '@lockerpm/design';

import {
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

import cipherComponents from "../../../../components/cipher";
import quickShareComponents from "../../../../components/quick-share";

const Content = (props) => {
  const { DetailList } = cipherComponents;
  const { Name } = quickShareComponents;
  const {
    cipher,
    className
  } = props
  const { t } = useTranslation();
  const [showText, setShowText] = useState(false)
  useEffect(() => {
  }, [])

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <Name
          cipher={cipher}
          showText={showText}
        />
        <Button
          className="mt-4"
          icon={showText ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={() => setShowText(!showText)}
          type={'text'}
        >
          {showText ? t('quick_share_detail.hide_information') : t('quick_share_detail.reveal_information')}
        </Button>
      </div>
      <DetailList
        cipher={cipher}
        showText={showText}
        isPublic
      />
    </div>
  );
}

export default Content;