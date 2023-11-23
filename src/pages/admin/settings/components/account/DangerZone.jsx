import React, { useState } from "react";
import {
  Card,
  Button,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { PasswordConfirmModal } from "../../../../../components";

import userServices from "../../../../../services/user";
import commonServices from "../../../../../services/common";

import global from "../../../../../config/global";

import { red } from '@ant-design/colors';

const DangerZone = (props) => {
  const { } = props
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const handlePurgeData = async (password) => {
    setCallingAPI(true);
    await userServices.purge_data({ master_password_hash: password })
      .then(async () => {
        global.pushSuccess(t('notification.success.account_details.purged'));
        await commonServices.sync_data();
        setConfirmVisible(false);
      }).catch((error) => {
        global.pushError(error)
      }
    )
    setCallingAPI(false);
  }

  return (
    <div>
      <Card bodyStyle={{ padding: 16 }} className="mb-4">
        <div className="flex justify-between">
          <p className="font-semibold" style={{ color: red.primary }}>
            {t('account_details.danger_zone.delete_data')}
          </p>
          <Button
            type='primary'
            danger
            ghost
            onClick={() => setConfirmVisible(true)}
          >
            {t('account_details.danger_zone.delete_data')}
          </Button>
        </div>
        <p className="mt-1">
          {t('account_details.danger_zone.delete_data_desc')}
        </p>
      </Card>
      <PasswordConfirmModal
        visible={confirmVisible}
        title={t('account_details.danger_zone.delete_all_account_items')}
        okText={t('button.delete')}
        callingAPI={callingAPI}
        onConfirm={handlePurgeData}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
}

export default DangerZone;