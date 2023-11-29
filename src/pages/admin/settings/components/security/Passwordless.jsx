import React, { useState, useEffect } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components'

import FormDataModal from "./passwordless/FormData";

import userServices from "../../../../../services/user";
import authServices from "../../../../../services/auth";
import passwordlessServices from "../../../../../services/passwordless";

import {
  DownOutlined,
  RightOutlined,
  UsbOutlined,
  PlusOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import { green } from '@ant-design/colors';
import global from "../../../../../config/global";

const FormData = (props) => {
  const { 
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo)
  const isConnected = useSelector((state) => state.service.isConnected);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [password, setPassword] = useState(null);

  const [expand, setExpand] = useState(false);
  const [credential, setCredential] = useState(null);

  useEffect(() => {
    getPwlCredential();
  }, [])

  const getPwlCredential = async () => {
    const credential = await passwordlessServices.get_credential();
    setCredential(credential || null)
  }

  const handlePasswordlessAction = () => {
    if (userInfo?.login_method === 'passwordless') {
      setFormVisible(true)
    } else {
      setConfirmVisible(true)
    }
  }

  const handleConfirmPassword = async (passwordHash, password) => {
    setPassword(password);
    setConfirmVisible(false);
    setFormVisible(true);
  }

  const handleTurnOnPwl = async (newPassword) => {
    setCallingAPI(true);
    await userServices.change_password({
      username: userInfo.email,
      password: password,
      new_password: newPassword,
      login_method: 'passwordless'
    }).then(async () => {
      global.pushSuccess(t('notification.success.change_password.changed'));
      authServices.logout();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  const handleTurnOffPwl = async (data) => {
    setCallingAPI(true);
    await userServices.change_password({
      username: userInfo.email,
      password: data.password,
      new_password: data.new_password,
      login_method: 'password'
    }).then(async () => {
      global.pushSuccess(t('notification.success.change_password.changed'));
      authServices.logout();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        {
          userInfo?.login_method === 'passwordless' ? <div
            className="flex text-primary cursor-pointer"
            onClick={() => setExpand(!expand)}
          >
            <p className="font-semibold text-xl mr-2">
              {t('security.passwordless.title')}
            </p>
            {
              expand ? <DownOutlined /> : <RightOutlined />
            }
          </div> : <p className="font-semibold text-xl">
            {t('security.passwordless.title')}
          </p>
        }
        {
          isConnected && userInfo?.login_method !== 'passwordless' && <Button
            type='primary'
            ghost
            icon={<UsbOutlined />}
            onClick={() => handlePasswordlessAction()}
          >
            { t('security.passwordless.turn_on') }
          </Button>
        }
        {
          isConnected && userInfo?.login_method === 'passwordless' && !userInfo.is_require_passwordless && <Button
            type='primary'
            ghost
            icon={<UsbOutlined />}
            onClick={() => handlePasswordlessAction()}
          >
            {t('security.passwordless.turn_off')}
          </Button>
        }
      </div>
      <p className="mt-1">
        {t('security.passwordless.description')}
      </p>
      {
        !isConnected && <Button
          type='primary'
          className="mt-4"
          icon={<DownloadOutlined />}
        >
          {t('button.download_desktop_app')}
        </Button>
      }
      {
        expand && <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold" style={{ fontSize: 16 }}>
              {t('security.passwordless.security_keys_added')}
            </p>
            <Button
              type='text'
              ghost
              icon={<PlusOutlined />}
              onClick={() => {}}
            >
              {t('security.passwordless.add_new_key')}
            </Button>
          </div>
        </div>
      }
      <PasswordConfirmModal
        visible={confirmVisible}
        title={t('security.two_fa.turn_off')}
        okText={t('button.confirm')}
        onConfirm={handleConfirmPassword}
        onClose={() => setConfirmVisible(false)}
      />
      {
        formVisible && isConnected && <FormDataModal
          changing={callingAPI}
          visible={formVisible}
          onConfirm={userInfo?.login_method === 'passwordless' ? handleTurnOffPwl : handleTurnOnPwl}
          onClose={() => setFormVisible(false)}
        />
      }
    </div>
  );
}

export default FormData;
