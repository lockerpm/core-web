import React, { useState, useEffect } from "react";
import {
  Button,
  List,
  Tooltip
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  PasswordConfirmModal
} from '../../../../../components'

import FormDataModal from "./passwordless/FormData";
import NewKeyModal from "./passwordless/NewKey";

import userServices from "../../../../../services/user";
import authServices from "../../../../../services/auth";

import {
  DownOutlined,
  RightOutlined,
  UsbOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import global from "../../../../../config/global";
import common from "../../../../../utils/common";

const FormData = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.auth.userInfo)

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);
  const [password, setPassword] = useState(null);

  const [expand, setExpand] = useState(false);
  const [backupKeys, setBackupKeys] = useState([]);

  useEffect(() => {
    getBackupKeys();
  }, [])

  const getBackupKeys = async () => {
    await service.setApiToken(authServices.access_token());
    const response = await service.listBackupPasswordless();
    setBackupKeys(response || [])
  }

  const handleConfirmPassword = async (password) => {
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

  const handleAddedKey = async () => {
    setCallingAPI(true);
    await getBackupKeys();
    setNewKeyVisible(false);
    setCallingAPI(false);
  }

  const handleRemoveKey = async (keyId) => {
    global.confirm(async () => {
      try {
        await service.setApiToken(authServices.access_token())
        await service.deleteBackupPasswordless(keyId)
        await getBackupKeys();
      } catch (error) {
        global.pushError(error)
      }
    })
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
          userInfo?.login_method === 'password' && <Button
            type='primary'
            ghost
            icon={<UsbOutlined />}
            onClick={() => setConfirmVisible(true)}
          >
            {t('security.passwordless.turn_on')}
          </Button>
        }
        {
          userInfo?.login_method === 'passwordless' && <Tooltip
            title={userInfo.is_require_passwordless ? t('security.passwordless.require_passwordless') : ''}
          >
            <Button
              type='primary'
              ghost
              icon={<UsbOutlined />}
              disabled={userInfo.is_require_passwordless}
              onClick={() => setFormVisible(true)}
            >
              {t('security.passwordless.turn_off')}
            </Button>
          </Tooltip>
        }
      </div>
      <p className="mt-1">
        {t('security.passwordless.description')}
      </p>
      {
        expand && <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold" style={{ fontSize: 16 }}>
              {t('security.passwordless.security_keys_added')}
            </p>
            {
              backupKeys.length < global.constants.MAX_KEY_BACKUP && <Button
                type='primary'
                ghost
                icon={<PlusOutlined />}
                onClick={() => setNewKeyVisible(true)}
              >
                {t('security.passwordless.add_new_key')}
              </Button>
            }
          </div>
          <List
            className="mt-4"
            itemLayout="horizontal"
            dataSource={backupKeys}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveKey(item.id)}
                  >
                  </Button>
                ]}
              >
                <div className="flex items-center">
                  <UsbOutlined className="mr-4" style={{ fontSize: 28 }} />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>{t('common.updated_time')}: {common.convertDateTime(item.creation_date)}</p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      }
      <PasswordConfirmModal
        visible={confirmVisible}
        title={userInfo.password_method === 'passwordless' ? t('security.passwordless.turn_off') : t('security.passwordless.turn_on')}
        okText={t('button.confirm')}
        requireDesktop={true}
        onConfirm={handleConfirmPassword}
        onClose={() => setConfirmVisible(false)}
      />
      {
        formVisible && <FormDataModal
          changing={callingAPI}
          visible={formVisible}
          onConfirm={userInfo?.login_method === 'passwordless' ? handleTurnOffPwl : handleTurnOnPwl}
          onClose={() => setFormVisible(false)}
        />
      }
      {
        newKeyVisible && <NewKeyModal
          changing={callingAPI}
          visible={newKeyVisible}
          onConfirm={() => handleAddedKey()}
          onClose={() => setNewKeyVisible(false)}
        />
      }
    </div>
  );
}

export default FormData;
