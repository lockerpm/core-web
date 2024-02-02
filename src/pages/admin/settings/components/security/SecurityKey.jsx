import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  List,
} from '@lockerpm/design';

import {
  DownOutlined,
  RightOutlined,
  UsbOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import NewSecurityKeyModal from "./modals/NewSecurityKey";

import authServices from "../../../../../services/auth";

import global from "../../../../../config/global";
import common from "../../../../../utils/common";

const SecurityKey = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const isMobile = useSelector(state => state.system.isMobile);

  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const [expand, setExpand] = useState(false);
  const [backupKeys, setBackupKeys] = useState([]);

  useEffect(() => {
    getBackupKeys();
  }, [])

  const getBackupKeys = async () => {
    await service.setApiToken(authServices.access_token());
    const response = await service.listBackupPasswordless();
    setBackupKeys(response?.filter((k) => k.type === 'hmac') || [])
  }

  const handleAddedKey = async () => {
    global.pushSuccess(t('notification.success.security_key.added'))
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
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.passwordless.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        {
          backupKeys.length < global.constants.MAX_KEY_BACKUP && <Button
            type='primary'
            ghost
            icon={<PlusOutlined />}
            onClick={() => setNewKeyVisible(true)}
          >
            {isMobile ? '' : t('security.passwordless.add_new_key')}
          </Button>
        }
      </div>
      <p className="mt-1">
        {t('security.passwordless.description')}
      </p>
      {
        expand && <div className="mt-4">
          <List
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
      {
        newKeyVisible && <NewSecurityKeyModal
          changing={callingAPI}
          visible={newKeyVisible}
          onConfirm={() => handleAddedKey()}
          onClose={() => setNewKeyVisible(false)}
        />
      }
    </div>
  );
}

export default SecurityKey;
