import React, { useEffect } from "react";

import {
} from '@lockerpm/design';
import { useSelector } from 'react-redux';

import { useTranslation } from "react-i18next";
import global from "../../../../config/global";
import CyStack from '../../../../assets/images/logos/CyStack.png'

const Bottom = () => {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.system.locale)
  useEffect(() => {
  }, [])

  return (
    <div
      className="md:flex md:items-center py-3 landing-font-12 text-black-600 max-w-6xl mx-auto px-6"
      style={{ minHeight: 50 }}
    >
      <div className="flex items-center">
        <div>{t('quick_share_detail.product_of')}</div>
        <a
          href={locale === 'vi' ? 'https://cystack.net/vi' : 'https://cystack.net'}
          target="_blank"
          className="flex items-center"
        >
          <img
            className="ml-2 mr-3"
            style={{ height: 16 }}
            src={CyStack}
            alt="CyStack"
          />
        </a>
      </div>
      <p className="!break-normal">
        {t('quick_share_detail.copyright', { year: new Date().getFullYear() })}
      </p>
      <div className="flex-grow md:text-right">
        <a
          href={`${global.urls.LOCKER_URL}/terms`}
          target="_blank"
          className="mr-4"
        >
            {t('quick_share_detail.terms')}
          </a>
        <a
          href={`${global.urls.LOCKER_URL}/privacy`}
          target="_blank"
        >
          {t('quick_share_detail.privacy_policy')}
        </a>
      </div>
    </div>
  );
}

export default Bottom;