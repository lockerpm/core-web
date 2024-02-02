import React, { useEffect } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Image,
  Button
} from '@lockerpm/design';

import images from "../../../../assets/images";

import global from "../../../../config/global";

const { IntroImg } = images;

const Right = () => {
  const { t } = useTranslation();

  useEffect(() => {
  }, [])

  return (
    <div
      className="w-full py-6 px-2"
      style={{
        borderLeftWidth: 1,
        borderColor: 'var(--border-color)'
      }}
    >
      <Image
        src={IntroImg}
        preview={false}
      />
      <div style={{ marginTop: -80 }}>
        <p className="text-2xl text-primary font-semibold">
          {t('quick_share_detail.title')}
        </p>
        <p className="mt-4">
          {t('quick_share_detail.description')}
        </p>
        <Button
          type="primary"
          className="mt-4"
        >
          <a href={`${global.urls.LOCKER_URL}/register`} target="_blank">
            {t('quick_share_detail.action')}
          </a>
        </Button>
      </div>
    </div>
  );
}

export default Right;