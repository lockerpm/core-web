import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Tag,
  Popover
} from '@lockerpm/design';

import {
  InfoCircleOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../../../components/items";
import sharedCipherComponents from "../../../../../../components/shared-cipher";

import common from "../../../../../../utils/common";

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const {
    CipherName,
    CipherActions,
    FolderName,
    FolderActions
  } = sharedCipherComponents;
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    isFolder = false,
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {},
    onAttachment = () => {},
    onDetail = () => {}
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
        <List.Item
          style={{ padding: 0 }}
          className="mb-0"
        >
          <div
            key={record.id}
            className="flex items-center justify-between w-full py-1 h-[52px]"
          >
            <div className="flex items-center flex-1">
              {
                isFolder ? <FolderName folder={record}/> : <CipherName
                  cipher={record}
                  onClick={() => onDetail(record)}
                />
              }
            </div>
            <div className="flex items-center ml-2 w-[112px] justify-end">
              <Popover
                className="mr-2 cursor-pointer"
                placement="top"
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
                  onAttachment={onAttachment}
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
