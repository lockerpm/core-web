import React, { useState, useEffect } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components'

import ConfirmParingModal from "./passwordless/ConfirmParing";
import FormDataModal from "./passwordless/FormData";

import userServices from "../../../../../services/user";
import commonServices from "../../../../../services/common";

import {
  DownOutlined,
  RightOutlined,
  UsbOutlined,
  PlusOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

const FormData = (props) => {
  const { 
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo)
  const isDesktop = useSelector((state) => state.system.isDesktop);
  const isConnected = useSelector((state) => state.service.isConnected);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pairingVisible, setPairingVisible] = useState(false); 
  const [formVisible, setFormVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [password, setPassword] = useState(null);

  const [expand, setExpand] = useState(false);

  useEffect(() => {
  }, [])

  const handleConfirm = async (passwordHash, password) => {
    setPassword(password);
    setConfirmVisible(false);
    if (isDesktop || service.pairingService?.hasKey) {
      setFormVisible(true)
    } else {
      setPairingVisible(true)
    }
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
      await commonServices.fetch_user_info();
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        {
          userInfo.is_passwordless ? <div
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
          isConnected && <Button
            type='primary'
            ghost
            icon={<UsbOutlined />}
            onClick={() => setConfirmVisible(true)}
          >
            {userInfo.is_passwordless ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')}
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
          {t('security.passwordless.download_desktop_app')}
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
        onConfirm={handleConfirm}
        onClose={() => setConfirmVisible(false)}
      />
      {
        isConnected && <ConfirmParingModal
          visible={pairingVisible}
          onConfirm={() => {
            setPairingVisible(false);
            setFormVisible(true)
          }}
          onClose={() => setPairingVisible(false)}
        />
      }
      {
        formVisible && isConnected && <FormDataModal
          changing={callingAPI}
          visible={formVisible}
          onConfirm={handleTurnOnPwl}
          onError={() => {
            setFormVisible(false);
            setPairingVisible(true)
          }}
          onClose={() => setFormVisible(false)}
        />
      }
    </div>
  );
}

export default FormData;
