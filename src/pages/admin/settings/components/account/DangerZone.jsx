import React, { useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import {
  red
} from '@ant-design/colors';

import modalsComponents from "../../../../../components/modals";

import userServices from "../../../../../services/user";
import commonServices from "../../../../../services/common";

import global from "../../../../../config/global";

const DangerZone = (props) => {
  const { PasswordConfirmModal } = modalsComponents;
  const { } = props
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const handlePurgeData = async (password) => {
    setCallingAPI(true);
    const keyHash = await global.jsCore.cryptoService.hashPassword(password, null)
    await userServices.purge_data({ master_password_hash: keyHash })
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