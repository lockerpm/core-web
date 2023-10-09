import React, { useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy
} from '../../../../../components'

import {
  convertDateTime,
  getEnvironment
} from '../../../../../utils/common'

import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const TableData = (props) => {
  const { t } = useTranslation();
  const isReadOnly = useSelector((state) => state.project.isReadOnly)
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    environments = [],
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
        width: 80,
      },
      {
        title: t('secret.key'),
        dataIndex: 'key',
        key: 'key',
        width: 300,
        align: 'left',
        render: (_, record) => <TextCopy
          value={record.secret.key}
        />
      },
      {
        title: t('secret.value'),
        dataIndex: 'value',
        key: 'value',
        align: 'left',
        width: 300,
        render: (_, record) => <TextCopy
          isPassword
          value={record.secret.value}
        />
      },
      {
        title: t('secret.environment'),
        dataIndex: 'environmentId',
        key: 'environmentId',
        align: 'left',
        width: 200,
        render: (_, record) => {
          const environment = getEnvironment(record.environmentId, environments)
          return environment ? <div>
            <Tag
              color={environment?.color}
            >
              <TextCopy
                value={environment?.name}
              />
            </Tag>
          </div> : <></>
        }
      },
      {
        title: t('common.created_time'),
        dataIndex: 'creationDate',
        key: 'creationDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={convertDateTime(record.creationDate)}
          align={'center'}
        />
      },
      {
        title: t('common.updated_time'),
        dataIndex: 'updatedDate',
        key: 'updatedDate',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={convertDateTime(record.updatedDate)}
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
        hide: isReadOnly,
        render: (_, record) => (
          <Space size={[8, 8]}>
            <Button
              icon={<EditOutlined />}
              type={'link'}
              onClick={() => onUpdate(record)}
            ></Button>
            <Button
              icon={<DeleteOutlined />}
              type={'link'}
              danger
              onClick={() => onDelete(record)}
            ></Button>
          </Space>
        ),
      },
    ].filter((c) => !c.hide)
  }, [isReadOnly])
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
