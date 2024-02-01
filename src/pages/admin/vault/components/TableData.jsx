import React, { useMemo } from "react";
import {
  Table,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import components from '../../../../components';

import {
} from "@ant-design/icons";

import Name from "../../../../components/vault/Name";
import Actions from "../../../../components/vault/Actions";

import common from "../../../../utils/common";

const TableData = (props) => {
  const {
    TextCopy,
  } = components;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    selectedRowKeys = [],
    onMove = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    onRestore = () => {},
    onShare = () => {},
    onStopSharing = () => {},
    onPermanentlyDelete = () => {},
    selectionChange = () => {},
    getCheckboxProps = () => {}
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
        title: t('common.created_time'),
        dataIndex: 'creationDate',
        key: 'creationDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={common.timeFromNow(record.creationDate)}
          align={'center'}
        />
      },
      {
        title: t('common.updated_time'),
        dataIndex: 'revisionDate',
        key: 'revisionDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={common.timeFromNow(record.revisionDate)}
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
        render: (_, record) => (
          <Actions
            cipher={record}
            onMove={onMove}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onRestore={onRestore}
            onShare={onShare}
            onStopSharing={onStopSharing}
            onPermanentlyDelete={onPermanentlyDelete}
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
      rowSelection={{
        columnWidth: 25,
        selectedRowKeys: selectedRowKeys,
        onChange: selectionChange,
        getCheckboxProps: getCheckboxProps,
      }}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
