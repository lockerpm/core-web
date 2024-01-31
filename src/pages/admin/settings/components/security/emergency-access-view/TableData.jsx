import React, { useMemo } from "react";
import {
  Table,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from "@ant-design/icons";

import Name from "./table/Name";
import Actions from "./table/Actions";

const TableData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    allCiphers = [],
    onReview = () => {}
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
        render: (_, record) => <Name
          cipher={record}
          allCiphers={allCiphers}
          onReview={onReview}
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
            allCiphers={allCiphers}
            cipher={record}
          />
        ),
      },
    ].filter((c) => !c.hide)
  }, [allCiphers])
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
