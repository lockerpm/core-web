import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
  Tag
} from '@lockerpm/design';

import itemsComponents from "../../../../../../components/items";
import sharedCipherComponents from "../../../../../../components/shared-cipher";

import common from "../../../../../../utils/common";
import global from "../../../../../../config/global";

const TableData = (props) => {
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
    params = {},
    onMove = () => {},
    onUpdate = () => {},
    onLeave = () => {},
    onUpdateStatus = () => {},
    onAttachment = () => {},
    onDetail = () => {}
  } = props;

  const locale = useSelector((state) => state.system.locale);

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
        width: 250,
        render: (_, record) => isFolder ? <FolderName folder={record}/> : <CipherName
          cipher={record}
          onClick={() => onDetail(record)}
        />
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
        width: 150,
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
        width: 180,
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
            onAttachment={onAttachment}
          />
        ),
      },
    ].filter((c) => !c.hide)
  }, [locale])

  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: global.constants.MAX_TABLE_WIDTH }}
    />
  );
}

export default TableData;
