import React, { } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

const HeaderTitle = (props) => {
  const {
    title = '',
    total = null,
    subtitle = '',
    isMarginTop = true,
  } = props

  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <div
      className="text-limited"
    >
      <p
        className={`page-header__left--title font-semibold w-full text-limited text-limited__block ${isMarginTop && !isMobile ? 'text-2xl' : 'text-xl'}`}
        title={title}
      >
        {title}
      </p>
      {
        ![null, undefined].includes(total) && <p
          className="page-header__left--subtitle text-black-500"
        >
          {t('common.total')}: {total}
        </p>
      }
      {
        subtitle && <p
          className="page-header__left--subtitle text-limited text-limited__block"
          title={subtitle}
        >
          {subtitle}
        </p>
      }
    </div>
  );
}

export default HeaderTitle;