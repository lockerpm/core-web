import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Switch,
  Divider
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import commonComponents from "../../../components/common";

import notificationServices from "../../../services/notification";

import global from "../../../config/global";

const { PageHeader } = commonComponents;

const Notifications = (props) => {
  const { } = props;
  const { t } = useTranslation();
  const language = useSelector((state) => state.system.language)

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, [])

  const fetchNotificationSettings = async () => {
    setLoading(true);
    await notificationServices.list_settings({ type: 'email' }).then((res) => {
      setData(res)
    }).catch(() => {
      setData([])
    })
    setLoading(false);
  }

  const updateSetting = async (item, value) => {
    await notificationServices.update_setting(item.category.id, { mail: value }).then((res) => {
      global.pushSuccess(t('notification.success.notification.updated'))
      setData(data.map((d) => ({ ...d, mail: item.category.id === d.category.id ? value : d.mail })))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <div className="email-notifications layout-content">
      <PageHeader
        title={t('email_notifications.title')}
        actions={[]}
      />
      <List
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Switch
                checked={item.mail}
                onChange={(v) => updateSetting(item, v)}
              />
            ]}
          >
            <p className="font-semibold">
              {item.category[`name_${language}`] || item.category.name}
            </p>
          </List.Item>
        )}
      />
      <Divider className="my-1"/>
    </div>
  );
}

export default Notifications;