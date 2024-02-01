import React, { useMemo } from "react";
import {
  Table,
  Tag
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from "@ant-design/icons";

import components from '../../../../../components'

import Name from "../../../../../components/vault/Name";
import common from "../../../../../utils/common";

const TableData = (props) => {
  const { PasswordStrength } = components;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    activeKey = ''
  } = props;

  const columns = useMemo(() => {
    return [
      {
        title: t('common.no'),
        dataIndex: 'stt',
        key: 'stt',
        align: 'center',
        width: 50,
      },
      {
        title: t('common.name'),
        dataIndex: 'title',
        key: 'name',
        align: 'left',
        render: (_, record) => <Name cipher={record}/>
      },
      {
        title: t('common.password_strength'),
        dataIndex: 'password_strength',
        key: 'password_strength',
        align: 'left',
        width: 300,
        hide: activeKey !== 'weak_passwords',
        render: (_, record) => <PasswordStrength
          password={record.login.password}
          showProgress={false}
        />
      },
      {
        title: t('common.last_used'),
        dataIndex: 'last_used',
        key: 'last_used',
        align: 'left',
        width: 300,
        hide: activeKey !== 'reused_passwords',
        render: (_, record) => <Tag color="warning">
          {t('security_tools.password_health.used_time_count', { count: common.separatorNumber(record.usedCount) })}
        </Tag>
      },
      {
        title: t('security_tools.password_health.exposed_time'),
        dataIndex: 'exposed_time',
        key: 'exposed_time',
        align: 'left',
        width: 300,
        hide: activeKey !== 'exposed_passwords',
        render: (_, record) => <Tag color="warning">
          {t('security_tools.password_health.exposed_time_count', { count: common.separatorNumber(record.exposedCount) })}
        </Tag>
      },
    ].filter((c) => !c.hide)
  }, [activeKey])

  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data.map((d, i) => ({ ...d, stt: i + 1 }))}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
