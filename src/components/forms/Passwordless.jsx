import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Spin,
  Input,
} from '@lockerpm/design';

import {
  UsbOutlined,
  CheckCircleOutlined,
  RedoOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { green } from '@ant-design/colors';

import ImageIcon from "../item/ImageIcon";

import { useTranslation } from "react-i18next";

import authServices from "../../services/auth";
import global from "../../config/global";

import storeActions from "../../store/actions";

const PasswordlessForm = (props) => {
  const { t } = useTranslation()
  const {
    changing = false,
    onConfirm = () => {},
    onError = () => {},
    onClose = () => {}
  } = props;

  const userInfo = useSelector(state => state.auth.userInfo)
  const isTouch = useSelector(state => state.service.isTouch)
  const isFingerprint = useSelector(state => state.service.isFingerprint)

  const [selectedDevice, setSelectedDevice] = useState(null)
  const [devices, setDevices] = useState([])
  const [step, setStep] = useState(0)
  const [pin, setPin] = useState(null)
  const [passwordless, setPasswordless] = useState(null)
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  useEffect(() => {
    global.store.dispatch(storeActions.updateIsTouch(false))
    global.store.dispatch(storeActions.updateIsFingerprint(false))
    setPasswordless(null)
    getDeviceKeys();
  }, [])

  const getDeviceKeys = async () => {
    setLoading(true)
    try {
      const devices = await service.getFidoDeviceList() || [];
      setDevices(devices);
      setSelectedDevice(devices[0] || null)
    } catch (error) {
      service.resetGRPCPorts();
      onError();
    }
    setLoading(false)
  }

  const setApiToken = async () => {
    await service.setApiToken(authServices.access_token());
    setPin(null);
    setStep(2);
    setPwl();
  }

  const setPwl = async () => {
    setCallingAPI(true)
    try {
      const response = await service.setNewPasswordless({
        email: userInfo.email,
        name: selectedDevice.name,
        devicePath: selectedDevice.path,
        pin: pin
      })
      setStep(2);
      setPasswordless(response)
      await onConfirm(response)
    } catch (error) {
      setStep(1);
      setPasswordless(null);
      global.pushError(error);
      service.resetGRPCPorts();
    }
    global.store.dispatch(storeActions.updateIsTouch(false));
    global.store.dispatch(storeActions.updateIsFingerprint(false))
    setCallingAPI(false)
  }

  return (
    <Spin spinning={loading || changing}>
      <div className="passwordless-form text-center">
        {
          step === 0 && <div>
            <p className="my-6">{t('passwordless.connect_key')}</p>
            {
              devices.length === 0 && <Card
                bodyStyle={{ padding: '12px 24px' }}
              >
                {t('passwordless.no_key_found')}
              </Card>
            }
            {
              devices.map((d, index) => <Card
                className="mt-4 cursor-pointer"
                key={index}
                bodyStyle={{ padding: '12px 24px' }}
                style={{ borderColor: selectedDevice?.path == d.path ? green[7] : ''  }}
                onClick={() => setSelectedDevice(d)}
              >
                <div className="flex items-center">
                  <UsbOutlined style={{ fontSize: 20 }}/>
                  <p className="font-semibold ml-2">
                    {t(d.name)}
                  </p>
                </div>
              </Card>)
            }
            <Button
              className="mt-4 w-full"
              type="text"
              size="large"
              icon={<RedoOutlined />}
              onClick={() => getDeviceKeys()}
            >
              {t('passwordless.reload_devices')}
            </Button>
            <Button
              className="mt-10 w-full"
              type="primary"
              size="large"
              disabled={!selectedDevice}
              onClick={setApiToken}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
        {
          step !== 0 && <Card
            className="mt-10"
            bodyStyle={{ padding: '12px 24px' }}
            style={{ borderColor: green[7]  }}
          >
            <div className="flex items-center">
              <UsbOutlined style={{ fontSize: 20 }}/>
              <p className="font-semibold ml-2">
                {t(selectedDevice.name)}
              </p>
            </div>
          </Card>
        }
        {
          step === 1 && !isTouch && <div className="mt-10">
            <p className="mt-6 text-left">{t('passwordless.enter_key_pin')}</p>
            <Input.Password
              className="mt-2"
              size="large"
              value={pin}
              disabled={callingAPI}
              placeholder={t('placeholder.enter')}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button
              className="mt-10 w-full"
              type="primary"
              size="large"
              disabled={!pin?.trim()}
              onClick={() => setPwl()}
              loading={callingAPI}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
        {
          (isTouch || isFingerprint) && <div className="mt-10">
            <p className="mt-6 text-left">
              { isTouch ? t('passwordless.touch_key') : t('passwordless.scan_fingerprint')}
            </p>
            <Card className="mt-2">
              <ImageIcon
                name={'fingerprint'}
                width={48}
                height={48}
              />
            </Card>
          </div>
        }
        {
          passwordless && <div className="mt-10 text-primary">
            <Card>
              <CheckCircleOutlined
                style={{ fontSize: 40, color: green[7] }}
              />
              <p className="text-xl mt-4">{t('common.successfully')}</p>
            </Card>
            <Button
              className="mt-10 w-full"
              size="large"
              onClick={() => onClose()}
            >
              {t('button.close')}
            </Button>
          </div>
        }
      </div>
    </Spin>
  );
}

export default PasswordlessForm;