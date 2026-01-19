import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
} from '@lockerpm/design';

import itemsComponents from "../../../../../components/items";
import cipherComponents from "../../../../../components/cipher";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const TableData = (props) => {
  const { TextCopy } = itemsComponents;
  const { HistoryActions } = cipherComponents;
  const { t } = useTranslation();
  const {
    className = '',
    data = [],
    isRestore = false,
    onRestore = () => {}
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
        title: t('common.password'),
        dataIndex: 'password',
        key: 'password',
        align: 'left',
        render: (_, record) => <TextCopy
          value={record.password}
          showIcon={false}
          show={false}
          align="between"
        />
      },
      {
        title: t('common.last_updated'),
        dataIndex: 'lastUsedDate',
        key: 'lastUsedDate',
        align: 'center',
        render: (_, record) => <TextCopy
          value={common.convertDateTime(record.lastUsedDate, 'LLL')}
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
          <HistoryActions
            className="flex items-center justify-end"
            item={record}
            isRestore={isRestore}
            onRestore={onRestore}
          />
        ),
      },
    ]
  }, [locale])

  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data.map((d, index) => ({ ...d, stt: index + 1 }))}
      pagination={false}
      rowKey={(record) => record?.stt}
      size="small"
      scroll={{ x: global.constants.MAX_TABLE_WIDTH }}
    />
  );
}

export default TableData;
