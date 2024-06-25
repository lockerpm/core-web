import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
  Button,
  Dropdown
} from '@lockerpm/design';

import {
  EllipsisOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";

import common from "../../../../../utils/common";

const TableData = (props) => {
  const { TextCopy } = itemsComponents;
  const { t } = useTranslation();
  const {
    className = '',
    data = [],
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
          defaultShow={false}
        />
      },
      {
        title: t('common.updated_time'),
        dataIndex: 'revisionDate',
        key: 'revisionDate',
        align: 'center',
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
          <Dropdown
            menu={{ items: [
              {
                key: 'copy',
                label: t('common.copy'),
                onClick: () => common.copyToClipboard(record.password)
              },
              {
                key: 'restore',
                label: t('inventory.actions.restore'),
                onClick: () => onRestore(record.password)
              },
            ] }}
            trigger={['click']}
          >
            <Button
              type="text"
              size={'small'}
              icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
            />
          </Dropdown>
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
      rowKey={(record) => record?.id}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
