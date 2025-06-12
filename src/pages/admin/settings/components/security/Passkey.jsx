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

import securityModalsComponents from "./modals";

import global from "../../../../../config/global";
import common from "../../../../../utils/common";

const Passkey = (props) => {
  const { NewPasskeyModal } = securityModalsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const isConnected = useSelector(state => state.service.isConnected)
  const isMobile = useSelector(state => state.system.isMobile);

  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [callingAPI, setCallingAPI] = useState(false);

  const [expand, setExpand] = useState(false);
  const [backupKeys, setBackupKeys] = useState([]);

  useEffect(() => {
    getBackupKeys();
  }, [isConnected])

  const getBackupKeys = async () => {
    if (isConnected) {
      const apiToken = await common.getAccessToken();
      await service.setApiToken(apiToken);
      const response = await service.listBackupPasswordless();
      setBackupKeys(response?.filter((k) => k.type !== 'hmac') || [])
    }
  }

  const handleAddedKey = async () => {
    global.pushSuccess(t('notification.success.passkey.added'))
    setCallingAPI(true);
    await getBackupKeys();
    setNewKeyVisible(false);
    setCallingAPI(false);
  }

  const handleRemoveKey = async (keyId) => {
    global.confirm(async () => {
      try {
        const apiToken = await common.getAccessToken();
        await service.setApiToken(apiToken)
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
            {t('security.passkey.title')}
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
            {isMobile ? '' : t('security.passkey.add_new_key')}
          </Button>
        }
      </div>
      <p className="mt-1">
        {t('security.passkey.description')}
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
        newKeyVisible && <NewPasskeyModal
          changing={callingAPI}
          visible={newKeyVisible}
          onClose={() => setNewKeyVisible(false)}
          onConfirm={() => handleAddedKey()}
        />
      }
    </div>
  );
}

export default Passkey;
