import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import emergencyAccessComponents from "../../../../../../components/emergency-access";

import global from "../../../../../../config/global";

const TableData = (props) => {
  const { Name, ViewActions } = emergencyAccessComponents;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    allCiphers = [],
    onReview = () => {}
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
          <ViewActions
            allCiphers={allCiphers}
            cipher={record}
          />
        ),
      },
    ].filter((c) => !c.hide)
  }, [allCiphers, locale])

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
