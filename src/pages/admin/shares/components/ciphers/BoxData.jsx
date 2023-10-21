import React, { useMemo } from "react";
import {
  Collapse,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../../components';

import Name from "./table/Name";
import Actions from "./table/Actions";

import common from "../../../../../utils/common";

import {
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props;

  const boxData = useMemo(() => {
    return data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))
  }, [data])

  return (
    <Collapse
      className={className}
      bordered={true}
      expandIconPosition="end"
      size="small"
      collapsible='icon'
      loading={loading}
    >
      {
        boxData.map((record) => <Collapse.Panel
          key={record.id}
          header={<div
            className="flex align-items justify-between"
          >
            <div className="flex align-items">
              <Name cipher={record}/>
            </div>
            <Actions
              cipher={record}
              onMove={onMove}
              onUpdate={onUpdate}
              onLeave={onLeave}
              onUpdateStatus={onUpdateStatus}
            />
          </div>}
        >
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('roles.owner')}:</p>
            <p>
              {record.owner ? record.owner.full_name : common.getOrganization(record.organizationId).name}
            </p>
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('common.type')}:</p>
            <p>
              {common.cipherTypeInfo('type', record.cipher_type || record.type).name}
            </p>
          </div>
          <div className="flex items-center">
            <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
            <TextCopy
              value={record.revisionDate ? common.timeFromNow(record.revisionDate) : common.timeFromNow(record.access_time)}
              align={'center'}
            />
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('common.status')}:</p>
            {
              (() => {
                const status = common.getInvitationStatus(record.status)
                return <Tag color={status.color}>
                  {status.label}
                </Tag>
              })()
            }
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('shares.share_type')}:</p>
            {
              (() => {
                const permission = common.getSharePermission(record.share_type)
                return permission.label
              })()
            }
          </div>
        </Collapse.Panel>)
      }
    </Collapse>
  );
}

export default BoxData;
