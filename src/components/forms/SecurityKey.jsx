import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

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

import itemsComponents from "../items";

import commonServices from "../../services/common";

import storeActions from "../../store/actions";
import global from "../../config/global";
import common from "../../utils/common";

const SecurityKeyForm = (props) => {
  const { ImageIcon } = itemsComponents;
  const { t } = useTranslation()
  const {
    changing = false,
    userInfo = {},
    isAddKey = false,
    accessToken = null,
    onRepair = () => { },
    onConfirm = () => { }
  } = props;

  const isTouch = useSelector(state => state.service.isTouch)
  const isConnected = useSelector(state => state.service.isConnected)
  const isFingerprint = useSelector(state => state.service.isFingerprint)

  const [selectedDevice, setSelectedDevice] = useState(null)
  const [devices, setDevices] = useState([])
  const [step, setStep] = useState(0)
  const [pin, setPin] = useState(null)
  const [passwordless, setPasswordless] = useState(null)
  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  useEffect(() => {
    resetState();
    setPasswordless(null);
  }, [])

  useEffect(() => {
    getDeviceKeys();
  }, [isConnected])

  const resetState = () => {
    global.store.dispatch(storeActions.updateIsTouch(false));
    global.store.dispatch(storeActions.updateIsFingerprint(false))
  }

  const getDeviceKeys = async () => {
    if (isConnected) {
      setLoading(true)
      try {
        const deviceList = await service.getFidoDeviceList() || [];
        const devices = deviceList.filter((d) => !d.name?.toLowerCase()?.includes('windows hello'))
        setDevices(devices);
        setSelectedDevice(devices[0] || null)
      } catch (error) {
        redirectByError(error)
      }
      setLoading(false)
    }
  }

  const handleContinue = async (pin = null) => {
    setPin(pin);
    if (!isAddKey) {
      await getPwl();
    } else {
      const apiToken = accessToken || await common.getAccessToken();
      await service.setApiToken(apiToken);
      await setBackupPwl();
    }
  }

  const setBackupPwl = async () => {
    setCallingAPI(true)
    try {
      const encKey = await global.jsCore.cryptoService.getEncKey();
      const response = await service.setBackupPasswordless({
        email: userInfo.email,
        name: selectedDevice.name,
        devicePath: selectedDevice.path,
        deviceName: selectedDevice.name,
        currentEncKey: encKey.key,
        pin: pin
      })
      setStep(2);
      setPasswordless(response);
      await onConfirm();
    } catch (error) {
      redirectByError(error)
    }
    setCallingAPI(false)
  }

  const getPwl = async () => {
    setCallingAPI(true)
    try {
      const response = await service.getPasswordless({
        email: userInfo.email,
        devicePath: selectedDevice.path,
        pin: pin,
        onlyBackup: userInfo.login_method === 'password'
      })
      setStep(2);
      setPasswordless(response)
      await onConfirm(response)
    } catch (error) {
      redirectByError(error)
    }
    setCallingAPI(false)
  }

  const redirectByError = async (error) => {
    resetState()
    setPasswordless(null)
    setPin(null)
    if (['0000'].includes(error.code)) {
      await commonServices.reset_service();
      onRepair();
    } else if (['2007', '2003', '2009'].includes(error.code)) {
      if (selectedDevice) {
        setStep(1);
        return;
      } else {
        setStep(0)
      }
    } else if (['2008', '2005', '2002', '2004', '2006', '2011'].includes(error.code)) {
      setStep(0);
    } else if (['5001', '5002'].includes(error.code)) {
      await commonServices.reset_service();
      setStep(0);
    } else if (['2001'].includes(error.code)) {
      await commonServices.reset_service();
      setStep(0);
      await getDeviceKeys();
    } else if (['5003'].includes(error.code)) {
      onRepair();
    } else {
      if (selectedDevice) {
        setStep(1);
        return;
      } else {
        setStep(0);
      }
    }
    console.log('Error', error);
    if (error.code) {
      global.pushError({ message: t(`passwordless.errors.${error.code}`) })
    } else {
      global.pushError(error)
    }
  }

  return (
    <Spin spinning={loading}>
      <div className="passwordless-form text-center">
        {
          step === 0 && !callingAPI && !changing && <div>
            <p className={`my-6 text-left`}>
              { isAddKey ? t('passwordless.connect_key') : t('passwordless.connect_security_key_to_login')}
            </p>
            {
              devices.length === 0 && <Card
                className="no-key-found"
                bodyStyle={{ padding: '8px 24px' }}
              >
                {t('passwordless.no_key_found')}
              </Card>
            }
            {
              devices.map((d, index) => <Card
                className={`mt-4 device-key cursor-pointer ${selectedDevice?.path == d.path ? 'border-green-700' : ''}`}
                key={index}
                bodyStyle={{ padding: '8px 24px' }}
                onClick={() => setSelectedDevice(d)}
              >
                <div className="flex items-center">
                  <UsbOutlined style={{ fontSize: 20 }} />
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
              onClick={() => handleContinue(null)}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
        {
          (step !== 0 || (isTouch || isFingerprint)) && selectedDevice && <Card
            className="mt-10 border-green-700"
            bodyStyle={{ padding: '8px 24px' }}
          >
            <div className="flex items-center">
              <UsbOutlined style={{ fontSize: 20 }} />
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
              onClick={() => handleContinue(pin)}
              loading={callingAPI}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
        {
          (isTouch || isFingerprint) && !passwordless && <div className="mt-10">
            {
              isAddKey && <p className="mt-6 text-left">
                {t('passwordless.touch_key_when_add')}
              </p>
            }
            {
              !isAddKey && (userInfo?.security_keys || []).length <= 1 && <p className="mt-6 text-left">
                {isTouch ? t('passwordless.touch_key') : t('passwordless.scan_fingerprint')}
              </p>
            }
            {
              !isAddKey && (userInfo?.security_keys || []).length > 1 && <p className="mt-6 text-left">
                {isTouch ? t('passwordless.touch_key_when_add') : t('passwordless.scan_fingerprint_twice')}
              </p>
            }
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
              <CheckCircleOutlined className="text-[40px] text-green-700"/>
              <p className="text-xl mt-4">{t('common.successfully')}</p>
            </Card>
            {
              changing && <Spin className="mt-4"></Spin>
            }
          </div>
        }
      </div>
    </Spin>
  );
}

export default SecurityKeyForm;