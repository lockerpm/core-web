import React, { useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Image,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink
} from '../../../../components'

import {
  timeFromNow,
  cipherSubtitle,
} from '../../../../utils/common'

import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import CipherIcon from "./CipherIcon";

import global from "../../../../config/global";

const TableData = (props) => {
  const { t } = useTranslation();
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    rowSelection = {},
    onUpdate = () => {},
    onDelete = () => {}
  } = props;

  const columns = useMemo(() => {
    return [
      {
        title: t('common.no'),
        dataIndex: 'stt',
        key: 'stt',
        align: 'center',
        width: 60,
      },
      {
        title: t('common.name'),
        dataIndex: 'title',
        key: 'name',
        width: 300,
        align: 'left',
        render: (_, record) => <div className="flex items-center">
          <CipherIcon
            item={record}
            type={record.type}
          />
          <div className="ml-2 flex-1">
            <RouterLink
              className={'font-semibold'}
              label={record.name}
              routerName={global.keys.VAULT_DETAIL}
              routerParams={{ id: record.id }}
            />
            <TextCopy
              className="text-sm"
              value={cipherSubtitle(allCiphers.find((d) => d.id === record.id))}
            />
          </div>
        </div>
      },
      {
        title: t('common.created_time'),
        dataIndex: 'creationDate',
        key: 'creationDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={timeFromNow(record.creationDate)}
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
          value={timeFromNow(record.revisionDate)}
          align={'center'}
        />
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
        fixed: 'right',
        width: 100,
        render: (_, record) => (
          <Space size={[8, 8]}>
          </Space>
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
      rowSelection={rowSelection}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
