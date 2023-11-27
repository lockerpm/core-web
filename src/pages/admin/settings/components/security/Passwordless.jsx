import React, { useState, useEffect } from "react";
import {
  Button,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components'

import FormData from "./passwordless/FormData";

import {
  DownOutlined,
  RightOutlined,
  UsbOutlined,
  PlusOutlined,
  DownloadOutlined
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

const Passwordless = (props) => {
  const { 
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo)
  const isCloud = useSelector((state) => state.system.isCloud);
  const isReady = useSelector((state) => state.service.isReady);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const [expand, setExpand] = useState(false);

  useEffect(() => {
  }, [])

  const handleConfirm = async (password) => {
    setCallingAPI(true);
    // await authServices.factor2_activate({ password }).then(() => {
    //   global.pushSuccess(t('notification.success.factor2.disabled'));
    //   getFactor2();
    //   setConfirmVisible(false);
    // }).catch((error) => {
    //   global.pushError(error)
    // })
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
          isReady && <Button
            type='primary'
            ghost
            icon={<UsbOutlined />}
            onClick={() => setFormVisible(true)}
          >
            {userInfo.is_passwordless ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')}
          </Button>
        }
        
      </div>
      <p className="mt-1">
        {t('security.passwordless.description')}
      </p>
      {
        !isReady && <Button
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
        callingAPI={callingAPI}
        okText={t('common.confirm')}
        onConfirm={handleConfirm}
        onClose={() => setConfirmVisible(false)}
      />
      <FormData
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default Passwordless;
