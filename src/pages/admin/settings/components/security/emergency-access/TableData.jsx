import React, { useMemo } from "react";
import {
  Table,
  Avatar,
  Tag,
  Tooltip
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from "@ant-design/icons";

import Actions from "./Actions";

import common from "../../../../../../utils/common";
import global from "../../../../../../config/global";

const TableData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    isTrusted = false
  } = props;

  const columns = useMemo(() => {
    return [
      {
        title: t('common.users'),
        dataIndex: 'email',
        key: 'email',
        align: 'left',
        render: (_, record) => <div className="flex items-center">
          <Avatar
            src={record.avatar}
          />
          <div className="ml-2">
            <div className="font-semibold">
              {record.email}
            </div>
            <small>
              {record.full_name}
            </small>
          </div>
        </div>
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 200,
        render: (_, record) => {
          const status = common.getStatus(record.status)
          const days = common.getEmergencyAccessDays(record)
          return <div className="flex items-center">
            <Tag color={status?.color}>
              {status?.label}
            </Tag>
            {
              status.value === global.constants.STATUS.RECOVERY_INITIATED && <Tooltip
                title={
                  t(`security.emergency_access.${isTrusted ? 'grantor_recovery_initiated_info' : 'grantee_recovery_initiated_info'}`, { day: days })
                }
              />
            }
          </div>
        }
      },
      {
        title: t('common.access_type'),
        dataIndex: 'access_type',
        key: 'access_type',
        align: 'center',
        width: 200,
        render: (_, record) => {
          const status = common.getAccess(record.type)
          return <Tag color={status?.color}>
            {status?.label}
          </Tag>
        }
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        align: 'right',
        fixed: 'right',
        width: 80,
        render: (_, record) => <Actions
          isTrusted={isTrusted}
          contact={record}
        />,
      },
    ].filter((c) => !c.hide)
  }, [isTrusted])
  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;