import React, { } from "react";
import {
  List,
  Popover,
  Avatar,
  Tag,
  Tooltip
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  InfoCircleOutlined
} from "@ant-design/icons";

import Actions from "./Actions";

import common from "../../../../../../utils/common";
import global from "../../../../../../config/global";

const BoxData = (props) => {
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

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-2">
        <p className="font-semibold mr-2">{t('common.status')}:</p>
        {
          (() => {
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
          })()
        }
      </div>
      <div className="flex items-center">
        <p className="font-semibold mr-2">{t('common.access_type')}:</p>
        {
          (() => {
            const status = common.getAccess(record.type)
            return <Tag color={status?.color}>
              {t(status?.label)}
            </Tag>
          })()
        }
      </div>
    </div>
  }

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
            <div className="flex items-center">
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
            <div className="flex items-center ml-2">
              <Popover
                className="mr-2 cursor-pointer"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
              <Actions
                className="flex items-center"
                isTrusted={isTrusted}
                contact={record}
                fetchTrusted={fetchTrusted}
                fetchGranted={fetchGranted}
                onResetPassword={onResetPassword}
                onResetMasterPassword={onResetMasterPassword}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default BoxData;
