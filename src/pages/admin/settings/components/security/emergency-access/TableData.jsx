import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
  Avatar,
  Tag,
  Tooltip
} from '@lockerpm/design';

import {
  InfoCircleOutlined
} from "@ant-design/icons";

import emergencyAccessComponents from "../../../../../../components/emergency-access";

import common from "../../../../../../utils/common";
import global from "../../../../../../config/global";

const TableData = (props) => {
  const { Actions } = emergencyAccessComponents;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    isTrusted = false,
    fetchTrusted = () => {},
    fetchGranted = () => {},
    onResetPassword = () => {},
    onResetMasterPassword = () => {}
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const columns = useMemo(() => {
    return [
      {
        title: t('common.users'),
        dataIndex: 'email',
        key: 'email',
        align: 'left',
        width: 300,
        render: (_, record) => <div className="flex items-center">
          <Avatar
            src={record.avatar}
          />
          <div className="ml-2">
            <div className="font-semibold text-limited">
              {record.email}
            </div>
            <small className="text-limited">
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
          return <div className="flex items-center justify-center">
            <Tag color={status?.color}>
              {t(status?.label)}
            </Tag>
            {
              status.value === global.constants.STATUS.RECOVERY_INITIATED && <Tooltip
                title={
                  t(`security.emergency_access.${isTrusted ? 'grantor_recovery_initiated_info' : 'grantee_recovery_initiated_info'}`, { day: days })
                }
              >
                <InfoCircleOutlined />
              </Tooltip>
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
            {t(status?.label)}
          </Tag>
        }
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        align: 'right',
        fixed: 'right',
        width: 100,
        render: (_, record) => <Actions
          isTrusted={isTrusted}
          contact={record}
          fetchTrusted={fetchTrusted}
          fetchGranted={fetchGranted}
          onResetPassword={onResetPassword}
          onResetMasterPassword={onResetMasterPassword}
        />,
      },
    ].filter((c) => !c.hide)
  }, [isTrusted, locale])

  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: 600 }}
    />
  );
}

export default TableData;
