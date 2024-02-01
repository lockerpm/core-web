import React, { useMemo } from "react";
import {
  List,
  Tag,
  Popover
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import components from '../../../../../components';

import CipherName from "./CipherName";
import CipherActions from "./CipherActions";
import FolderName from "./FolderName";
import FolderActions from "./FolderActions";

import common from "../../../../../utils/common";

import {
} from "@ant-design/icons";

const ListData = (props) => {
  const {
    TextCopy,
  } = components;
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    isFolder = false,
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {}
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('roles.owner')}:</p>
        <TextCopy
          className="text-xs"
          value={record.owner ? record.owner.full_name : common.getOrganization(record.organizationId).name}
        />
      </div>
      {
        !isFolder && <div className="flex items-center mb-1">
          <p className="font-semibold mr-2">{t('common.type')}:</p>
          <p>
            {t(common.cipherTypeInfo('type', record.cipher_type || record.type).name)}
          </p>
        </div>
      }
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
        <TextCopy
          className="text-xs"
          value={record.revisionDate ? common.timeFromNow(record.revisionDate) : common.timeFromNow(record.access_time)}
          align={'center'}
        />
      </div>
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('common.status')}:</p>
        {
          (() => {
            const status = common.getStatus(record.status)
            return <Tag color={status.color}>
              {t(status?.label)}
            </Tag>
          })()
        }
      </div>
      <div className="flex items-center">
        <p className="font-semibold mr-2">{t('shares.share_type')}:</p>
        {
          (() => {
            const permission = common.getSharePermission(record.share_type)
            return t(permission.label)
          })()
        }
      </div>
    </div>
  }


  return (
    <List
      bordered={false}
      dataSource={data.map((d) => ({ ...d, key: d.id }))}
      className={className}
      loading={loading}
      renderItem={(record) => (
        <List.Item>
          <div
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              {
                isFolder ? <FolderName folder={record}/> : <CipherName cipher={record}/>
              }
            </div>
            <div className="flex items-center">
              <Popover
                className="mr-2 cursor-pointer"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
              {
                isFolder ? <FolderActions
                  className="flex items-center"
                  folder={record}
                  onUpdate={onUpdate}
                  onLeave={onLeave}
                  onUpdateStatus={onUpdateStatus}
                /> : <CipherActions
                  className="flex items-center"
                  cipher={record}
                  onMove={onMove}
                  onUpdate={onUpdate}
                  onLeave={onLeave}
                  onUpdateStatus={onUpdateStatus}
                />
              }
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
