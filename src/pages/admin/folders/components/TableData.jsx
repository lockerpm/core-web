import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";
import folderComponents from "../../../../components/folder";

import common from "../../../../utils/common";
import global from "../../../../config/global";

const TableData = (props) => {
  const { TextCopy } = itemsComponents;
  const { Name, Actions } = folderComponents;
  const { t } = useTranslation();

  const locale = useSelector((state) => state.system.locale);

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onUpdate = () => {},
    onDelete = () => {},
    onStop = () => {},
    onShare = () => {}
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
        render: (_, record) => <Name item={record}/>
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
        width: 100,
        render: (_, record) => (
          <Actions
            item={record}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onStop={onStop}
            onShare={onShare}
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
