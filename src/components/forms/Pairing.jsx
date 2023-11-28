import React, { useState, useEffect } from "react";
import {
  Card,
  Button
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";

import {
  ReloadOutlined
} from "@ant-design/icons";

import global from "../../config/global";
import storeActions from "../../store/actions";

const PairingForm = (props) => {
  const { t } = useTranslation()
  const {
    onConfirm = () => {}
  } = props;

  const isDesktop = useSelector((state) => state.system.isDesktop)
  const approveCode = useSelector((state) => state.service.approveCode)
  const requireDesktop = useSelector((state) => state.service.requireDesktop)
  const pairingConfirmed = useSelector((state) => state.service.pairingConfirmed)
  const clientId = useSelector((state) => state.service.clientId);
  const clientType = useSelector((state) => state.service.clientType);

  const resetClient = async () => {
    try {
      await service.resetPairingCode(clientId)
    } catch (error) {
      global.pushError(error)
    }
  }

  const confirmClient = async () => {
    try {
      await service.confirmPairingClient(clientId, clientType);
      onConfirm();
    } catch (error) {
      global.pushError(error)
    }
  }

  const confirmDesktopPairing = async () => {
    try {
      await service.confirmDesktopPairing();
      global.store.dispatch(storeActions.updateApproveCode(null));
      onConfirm();
    } catch (error) {
      global.pushError(error)
    }
  }

  return (
    <div className="pairing-form text-center">
      <p className="mb-10 mt-6">{t(isDesktop ? 'passwordless.confirm_code' : 'passwordless.pairing_required')}</p>
      {
        approveCode && <div className="flex justify-center">
          <Card className="mb-6 w-full" bodyStyle={{ padding: '12px 24px' }}>
            <p className="font-semibold text-xl">{approveCode}</p>
          </Card>
        </div>
      }
      {
        approveCode ? <Button
          type="primary"
          className="w-full"
          disabled={!pairingConfirmed}
          size="large"
          onClick={() => { !isDesktop ? confirmDesktopPairing() : confirmClient() }}
        >
          {t('button.confirm')}
        </Button> : <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={() => service.sendPairingRequest()}
        >
          {t('button.continue')}
        </Button>
      }
      {
        isDesktop && <Button
          type="link"
          className="mt-6 w-full"
          icon={<ReloadOutlined />}
          onClick={() => resetClient}
        >
          {t('passwordless.reset_code')}
        </Button>
      }
      {
        requireDesktop && <p className="text-danger mt-4">
          {'passwordless.open_desktop'}
        </p>
      }
    </div> 
  );
}

export default PairingForm;