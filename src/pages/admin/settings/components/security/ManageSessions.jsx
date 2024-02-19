import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  List,
  Badge,
  Tag
} from '@lockerpm/design';

import {
  LogoutOutlined,
  RightOutlined,
  DownOutlined
} from "@ant-design/icons";

import securityModalsComponents from "./modals";

import userServices from "../../../../../services/user";

import common from "../../../../../utils/common";

const ManageSessions = (props) => {
  const { DeauthorizeSessionsModal } = securityModalsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const isMobile = useSelector(state => state.system.isMobile);

  const [expand, setExpand] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [listDevices, setListDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, [])

  const fetchDevices = async () => {
    const devices = await userServices.users_me_devices();
    setListDevices((devices || []).filter((d) => d.is_active))
  }
  
  const openModal = (item) => {
    setSelectedDevice(item)
    setConfirmVisible(true)
  }

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('security.manage_sessions.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        <Button
          type='primary'
          ghost
          danger
          icon={<LogoutOutlined />}
          onClick={() => openModal(null)}
        >
          {isMobile ? '' : t('security.manage_sessions.logout')}
        </Button>
      </div>
      {
        expand && <List
          className="mt-4"
          itemLayout="horizontal"
          dataSource={listDevices}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Tag>
                  <Badge status="success" />     
                  <span className="ml-2">{t('common.active')}</span>             
                </Tag>,
                <Button
                  danger
                  ghost
                  onClick={() => openModal(item)}
                >
                  {t('button.logout')}
                </Button>
              ]}
            >
              <div className="flex items-center">
                <div style={{ fontSize: 36 }}>
                  {common.getClientInfo(item.client_id).icon}
                </div>
                <div className="ml-2">
                  {
                    item.os && <div>
                      <span>
                        <span className="font-semibold">{item.os.family} {item.os.version}</span> {'|'} {item.browser.family} {item.browser.version}
                      </span>
                    </div>
                  }
                  <div>
                    {common.getClientInfo(item.client_id).name}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      }
      <DeauthorizeSessionsModal
        visible={confirmVisible}
        device={selectedDevice}
        onConfirm={fetchDevices}
        onClose={() => setConfirmVisible(false)}
      />
    </div>
  );
}

export default ManageSessions;
