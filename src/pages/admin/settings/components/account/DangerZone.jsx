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
      <Card bodyStyle={{ padding: 16 }} className="mb-4">
        <div className="flex justify-between">
          <p className="font-semibold" style={{ color: red.primary }}>
            {t('account_details.danger_zone.delete_data')}
          </p>
          <Button type='primary' danger ghost>
            {t('account_details.danger_zone.delete_data')}
          </Button>
        </div>
        <p className="mt-1">
          {t('account_details.danger_zone.delete_data_desc')}
        </p>
      </Card>
      <Card bodyStyle={{ padding: 16 }}>
        <div className="flex justify-between">
          <p className="font-semibold" style={{ color: red.primary }}>
            {t('account_details.danger_zone.delete_account')}
          </p>
          <Button type='primary' danger ghost>
            {t('account_details.danger_zone.delete_account')}
          </Button>
        </div>
        <p className="mt-1">
          {t('account_details.danger_zone.delete_data_desc')}
        </p>
      </Card>
    </div>
  );
}

export default DangerZone;