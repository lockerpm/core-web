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
    isLogin = false,
    userInfo = {},
    isAddKey = false,
    onConfirm = () => {},
    onError = () => {},
    onClose = () => {}
  } = props;

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
    resetState();
    setPasswordless(null);
    getDeviceKeys();
  }, [])

  const resetState = () => {
    global.store.dispatch(storeActions.updateIsTouch(false));
    global.store.dispatch(storeActions.updateIsFingerprint(false))
  }

  const getDeviceKeys = async () => {
    setLoading(true)
    try {
      const devices = await service.getFidoDeviceList() || [];
      setDevices(devices);
      setSelectedDevice(devices[0] || null)
    } catch (error) {
      service.resetBackgroundService();
      onError();
    }
    setLoading(false)
  }

  const handleContinue = async (pin = null) => {
    if ((isLogin || userInfo?.login_method === 'passwordless') && !isAddKey) {
      await getPwl();
    } else {
      setPin(pin);
      await service.setApiToken(authServices.access_token());
      if (isAddKey) {
        await setBackupPwl();
      } else {
        await setPwl();
      }
    }
  }

  const setPwl = async () => {
    setCallingAPI(true)
    try {
      setStep(2);
      const response = await service.setNewPasswordless({
        email: userInfo.email,
        name: selectedDevice.name,
        devicePath: selectedDevice.path,
        pin: pin
      })
      resetState();
      setPasswordless(response)
      await onConfirm(response)
    } catch (error) {
      setStep(1);
      setPasswordless(null);
      global.pushError(error);
      service.resetBackgroundService();
      resetState();
    }
    setCallingAPI(false)
  }

  const setBackupPwl = async () => {
    setCallingAPI(true)
    try {
      setStep(2);
      const encKey = await global.jsCore.cryptoService.getEncKey();
      const response = await service.setBackupPasswordless({
        email: userInfo.email,
        name: selectedDevice.name,
        devicePath: selectedDevice.path,
        deviceName: selectedDevice.name,
        currentEncKey: encKey.key,
        pin: pin
      })
      resetState();
      setPasswordless(response);
      await onConfirm();
    } catch (error) {
      setStep(1);
      setPasswordless(null);
      global.pushError(error);
      service.resetBackgroundService();
      resetState();
    }
    setCallingAPI(false)
  }

  const getPwl = async () => {
    setCallingAPI(true)
    try {
      setStep(2);
      const response = await service.getPasswordless({
        email: userInfo.email,
        devicePath: selectedDevice.path,
        pin: pin
      })
      resetState();
      setPasswordless(response)
      await onConfirm(response)
    } catch (error) {
      setStep(1);
      setPasswordless(null);
      global.pushError(error);
      service.resetBackgroundService();
      resetState();
    }
    setCallingAPI(false)
  }

  return (
    <Spin spinning={loading}>
      <div className="passwordless-form text-center">
        {
          step === 0 && <div>
            {
              isLogin && <p className={`my-6 text-left`}>
                {t('passwordless.connect_key_to_login')}
              </p>
            }
            {
              !isLogin && <p className={`my-6 text-left`}>
                {userInfo?.login_method === 'passwordless' ? t('passwordless.choose_a_key') : t('passwordless.connect_key')}
              </p>
            }
            {
              devices.length === 0 && <Card
                bodyStyle={{ padding: '9px 24px' }}
              >
                {t('passwordless.no_key_found')}
              </Card>
            }
            {
              devices.map((d, index) => <Card
                className="mt-4 cursor-pointer"
                key={index}
                bodyStyle={{ padding: '9px 24px' }}
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
              onClick={() => handleContinue(null)}
            >
              {t('button.continue')}
            </Button>
          </div>
        }
        {
          step !== 0 && <Card
            className="mt-10"
            bodyStyle={{ padding: '9px 24px' }}
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
              onClick={() => handleContinue(pin)}
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
            {
              changing && <Spin className="mt-4"></Spin>
            }
            {
              !isLogin && !userInfo?.login_method === 'passwordless' && !changing && <Button
                className="mt-10 w-full"
                size="large"
                onClick={() => onClose()}
              >
                {t('button.close')}
              </Button>
            }
          </div>
        }
      </div>
    </Spin>
  );
}

export default PasswordlessForm;