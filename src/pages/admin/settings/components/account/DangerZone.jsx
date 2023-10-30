import React, { } from "react";
import {
  Card,
  Button,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import { red } from '@ant-design/colors';

const DangerZone = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold" style={{ color: red.primary }}>
            {t('account_details.danger_zone.delete_data')}
          </p>
          <p>
            {t('account_details.danger_zone.delete_data_desc')}
          </p>
        </div>
        <Button type='primary' danger ghost>
          {t('account_details.danger_zone.delete_data')}
        </Button>
      </div>
      <div className="flex justify-between mt-6">
        <div>
          <p className="font-semibold" style={{ color: red.primary }}>
            {t('account_details.danger_zone.delete_account')}
          </p>
          <p>
            {t('account_details.danger_zone.delete_data_desc')}
          </p>
        </div>
        <Button type='primary' danger ghost>
          {t('account_details.danger_zone.delete_account')}
        </Button>
      </div>
    </div>
  );
}

export default DangerZone;