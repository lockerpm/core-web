import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
  Spin
} from '@lockerpm/design';

import {
  ReloadOutlined
} from "@ant-design/icons";

import storeActions from "../../store/actions"

import common from "../../utils/common";
import global from "../../config/global";

const PairingForm = (props) => {
  const { t } = useTranslation()
  const {
    callingAPI = false,
    onConfirm = () => {},
  } = props;

  const isConnected = useSelector((state) => state.service.isConnected)
  const isDesktopConnected = useSelector((state) => state.service.isDesktopConnected)
  const approveCode = useSelector((state) => state.service.approveCode)
  const pairingConfirmed = useSelector((state) => state.service.pairingConfirmed)

  const [connecting, setConnecting] = useState(false);
  const [isClickDownload, setIsClickDownload] = useState(false);

  useEffect(() => {
    if (pairingConfirmed) {
      confirmDesktopPairing();
    }
  }, [pairingConfirmed])

  const confirmDesktopPairing = async () => {
    try {
      await service.confirmDesktopPairing();
      global.store.dispatch(storeActions.updateApproveCode(null));
      onConfirm();
    } catch (error) {
      global.pushError(error)
    }
  }

  const connectDesktopService = async () => {
    setConnecting(true);
    const res = await service.grpcService?.resetConnection();
    if (!res) {
      global.pushError({ message: t('passwordless.connect_service_fail') })
    }
    setConnecting(false);
  }

  const connectDesktopSocket = async () => {
    const res = await service.socketService?.connectSocket();
    if (!res) {
      await connectDesktopSocket();
    }
  }


  return (
    <div className="pairing-form text-center">
      {
        isConnected && isDesktopConnected && <div>
          <p className="my-8 text-left">
            {t('passwordless.pairing_required')}
          </p>
          {
            approveCode && <div className="flex justify-center">
              <Card className="w-full" bodyStyle={{ padding: '6px 24px' }}>
                <p className="font-semibold text-xl">{approveCode}</p>
              </Card>
            </div>
          }
          {
            callingAPI && <div className="flex justify-center my-2">
              <Spin></Spin>
            </div>
          }
          {
            !callingAPI && <div className="mt-2">
              {
                !approveCode ? <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  onClick={() => service.sendPairingRequest()}
                >
                  {t('button.continue')}
                </Button> : <p
                  className="text-center text-black-500 hover:text-primary cursor-pointer"
                  onClick={() => service.sendPairingRequest()}
                >
                  <ReloadOutlined className="text-[13px]"/> <span>{t('passwordless.reset_code')}</span>
                </p>
              }
            </div>
          }
        </div>
      }
      {
        !isConnected && <div>
          <p className="my-8">
            { t('passwordless.install_desktop')}
          </p>
          {
            isClickDownload ? <Button
              type="primary"
              size="large"
              className="w-full"
              loading={connecting}
              onClick={() => connectDesktopService()}
            >
              {t('button.connect_desktop_app')}
            </Button> : <Button
              type="primary"
              size="large"
              className="w-full"
              onClick={() => {
                common.openNewTab(global.urls.DOWNLOAD_DESKTOP_URL);
                setIsClickDownload(true);
              }}
            >
              {t('button.download_desktop_app')}
            </Button>
          }
        </div>
      }
      {
        isConnected && !isDesktopConnected && <div>
          <p className="my-8">
            { t('passwordless.open_desktop')}
          </p>
          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={() => {
              common.openDesktopApp();
              service.grpcService?.resetConnection();
              setTimeout(() => {
                connectDesktopSocket();
              }, 5000)
            }}
          >
            {t('button.open_desktop_app')}
          </Button>
        </div>
      }
    </div> 
  );
}

export default PairingForm;