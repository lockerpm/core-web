import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Tag
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import cipherComponents from "../cipher";

import common from "../../utils/common";

const { PasswordStrength } = itemsComponents;
const { Name } = cipherComponents;

const ListData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    activeKey = ''
  } = props;

  return (
    <List
      bordered={false}
      dataSource={data}
      className={className}
      loading={loading}
      renderItem={(record) => (
        <List.Item>
          <div
            className="flex items-center justify-between w-full"
            key={record.id}
          >
            <Name cipher={record}/>
            <div className="flex items-center ml-2">
              {
                activeKey === 'weak_passwords' && <PasswordStrength
                  password={record.login.password}
                  showProgress={false}
                />
              }
              {
                activeKey === 'reused_passwords' && <Tag color="warning">
                  {t('security_tools.password_health.used_time_count', { count: common.separatorNumber(record.usedCount) })}
                </Tag>
              }
              {
                activeKey === 'exposed_passwords' && <Tag color="warning">
                  {t('security_tools.password_health.exposed_time_count', { count: common.separatorNumber(record.exposedCount) })}
                </Tag>
              }
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
