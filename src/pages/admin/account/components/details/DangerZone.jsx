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
import global from "../../../../../config/global";

const DangerZone = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Card
      bodyStyle={{
        padding: 16
      }}
    >
      <div className="flex justify-between">
        <p className="font-semibold" style={{ color: red.primary }}>
          {t('account_details.danger_zone.delete_data')}
        </p>
        <Button type='primary' danger disabled>
          {t('button.delete_data')}
        </Button>
      </div>
      <p>
        {t('account_details.danger_zone.delete_data_desc')}
      </p>
    </Card>
  );
}

export default DangerZone;