import React, { } from "react";
import {
  Card,
  Button
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";
import common from "../../utils/common";

import {
  ReloadOutlined
} from "@ant-design/icons";

import global from "../../config/global";

const PairingForm = (props) => {
  const { t } = useTranslation()
  const {
    callingAPI = false,
    onConfirm = () => {}
  } = props;

  const isConnected = useSelector((state) => state.service.isConnected)
  const isDesktopConnected = useSelector((state) => state.service.isDesktopConnected)
  const approveCode = useSelector((state) => state.service.approveCode)
  const pairingConfirmed = useSelector((state) => state.service.pairingConfirmed)
  const clientId = useSelector((state) => state.service.clientId);
  const clientType = useSelector((state) => state.service.clientType);

  const confirmClient = async () => {
    try {
      await service.confirmPairingClient(clientId, clientType);
      onConfirm();
    } catch (error) {
      global.pushError(error)
    }
  }

  return (
    <div className="pairing-form text-center">
      {
        isConnected && isDesktopConnected && <div>
          <p className="mb-10 mt-6 text-left">
            {t('passwordless.pairing_required')}
          </p>
          {
            approveCode && <div className="flex justify-center">
              <Card className="mb-6 w-full" bodyStyle={{ padding: '6px 24px' }}>
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
              loading={callingAPI}
              onClick={() => confirmClient()}
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
            approveCode && <div>
              <Button
                type="text"
                size="large"
                className="mt-2 w-full"
                icon={<ReloadOutlined />}
                onClick={() => service.sendPairingRequest()}
              >
                {t('passwordless.repair')}
              </Button>
            </div>
          }
          
        </div>
      }
      {
        !isConnected && <div>
          <p className="mb-10 mt-6">
            { t('passwordless.install_desktop')}
          </p>
          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={() => {}}
          >
            {t('button.download_desktop_app')}
          </Button>
        </div>
      }
      {
        isConnected && !isDesktopConnected && <div>
          <p className="mb-10 mt-6">
            { t('passwordless.open_desktop')}
          </p>
          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={() => common.openDesktopApp()}
          >
            {t('button.open_desktop_app')}
          </Button>
        </div>
      }
    </div> 
  );
}

export default PairingForm;