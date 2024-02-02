import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
  Tag
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../../../../../../components/items";
import sharedCipherComponents from "../../../../../../components/shared-cipher";

import common from "../../../../../../utils/common";

const { TextCopy } = itemsComponents;
const {
  CipherName,
  CipherActions,
  FolderName,
  FolderActions
} = sharedCipherComponents;

const TableData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    isFolder = false,
    params = {},
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {}
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
        render: (_, record) => isFolder ? <FolderName folder={record}/> : <CipherName cipher={record}/>
      },
      {
        title: t('roles.owner'),
        dataIndex: 'owner',
        key: 'owner',
        width: 150,
        align: 'left',
        render: (_, record) => <TextCopy
          value={record.owner ? record.owner.full_name : common.getOrganization(record.organizationId).name}
        />
      },
      {
        title: t('common.type'),
        dataIndex: 'title',
        key: 'name',
        width: 100,
        align: 'left',
        hide: isFolder,
        render: (_, record) => t(common.cipherTypeInfo('type', record.cipher_type || record.type).name)
      },
      {
        title: t('common.updated_time'),
        dataIndex: 'revisionDate',
        key: 'revisionDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={record.revisionDate ? common.timeFromNow(record.revisionDate) : common.timeFromNow(record.access_time)}
          align={'center'}
        />
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        key: 'name',
        width: 100,
        align: 'center',
        render: (_, record) => {
          const status = common.getStatus(record.status)
          return <Tag color={status.color}>
            {t(status?.label)}
          </Tag>
        }
      },
      {
        title: t('shares.share_type'),
        dataIndex: 'share_type',
        key: 'share_type',
        width: 150,
        align: 'center',
        render: (_, record) => {
          const permission = common.getSharePermission(record.share_type)
          return t(permission.label)
        }
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        align: 'right',
        fixed: 'right',
        width: 150,
        render: (_, record) => (
          isFolder ? <FolderActions
            folder={record}
            onUpdate={onUpdate}
            onLeave={onLeave}
            onUpdateStatus={onUpdateStatus}
          /> : <CipherActions
            cipher={record}
            onMove={onMove}
            onUpdate={onUpdate}
            onLeave={onLeave}
            onUpdateStatus={onUpdateStatus}
          />
        ),
      },
    ].filter((c) => !c.hide)
  }, [])
  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
