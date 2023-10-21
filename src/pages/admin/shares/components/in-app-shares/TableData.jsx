import React, { useMemo } from "react";
import {
  Table,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../../components';

import {
} from "@ant-design/icons";

import CipherName from "../../../vault/components/table/Name";
import FolderName from "../../../folders/components/table/Name";
import Actions from "./table/Actions";

import common from "../../../../../utils/common";

const TableData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    isFolder = false,
    onUpdate = () => {},
    onStopSharing = () => {},
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
        width: 250,
        align: 'left',
        render: (_, record) => isFolder ? <FolderName item={record}/> : <CipherName cipher={record}/>
      },
      {
        title: t('common.type'),
        dataIndex: 'title',
        key: 'name',
        width: 100,
        align: 'left',
        hide: isFolder,
        render: (_, record) => common.cipherTypeInfo('type', record.cipher_type || record.type).name
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
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        align: 'right',
        fixed: 'right',
        width: 150,
        render: (_, record) => <Actions
          item={record}
          onUpdate={onUpdate}
          onStopSharing={onStopSharing}
          onUpdateStatus={onUpdateStatus}
        />
      },
    ].filter((c) => !c.hide)
  }, [isFolder])
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
