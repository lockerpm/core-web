import React, { useEffect } from "react";

import {
  Card
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  useEffect(() => {
  }, [])

  return (
    <div>
      <p className="text-center text-xl font-semibold mb-6">
        {t('quick_share_detail.not_fond.title')}
      </p>
      <Card>
        <p>{t('quick_share_detail.not_fond.description.title')}</p>
        <ul className="ml-6">
          <li>{t('quick_share_detail.not_fond.description.note1')}</li>
          <li>{t('quick_share_detail.not_fond.description.note2')}</li>
          <li>{t('quick_share_detail.not_fond.description.note3')}</li>
        </ul>
      </Card>
    </div>
  );
}

export default NotFound;