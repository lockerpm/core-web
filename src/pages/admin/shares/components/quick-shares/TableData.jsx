import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Table,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";
import cipherComponents from "../../../../../components/cipher";
import quickShareComponents from "../../../../../components/quick-share";

import common from "../../../../../utils/common";

const TableData = (props) => {
  const { TextCopy } = itemsComponents;
  const { Actions, SharedWith } = quickShareComponents;
  const { Name } = cipherComponents;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onStopSharing = () => {},
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
        render: (_, record) => <Name
          send={record}
        />
      },
      {
        title: t('shares.shared_with'),
        dataIndex: 'shared_with',
        key: 'shared_with',
        align: 'center',
        width: 200,
        render: (_, record) => <SharedWith send={record}/>
      },
      {
        title: t('common.type'),
        dataIndex: 'title',
        key: 'name',
        width: 150,
        align: 'left',
        render: (_, record) => t(common.cipherTypeInfo('type', record.cipher.type).name)
      },
      {
        title: t('shares.quick_shares.sharing_time'),
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
        title: t('shares.quick_shares.views'),
        dataIndex: 'views',
        key: 'views',
        align: 'center',
        width: 100,
        render: (_, record) => `${record.accessCount}${record.maxAccessCount ? `/${record.maxAccessCount}` : ''} ${t('shares.quick_shares.views')}`
      },
      {
        title: t('shares.quick_shares.expiration'),
        dataIndex: 'expiration',
        key: 'expiration',
        align: 'center',
        width: 200,
        render: (_, record) => <TextCopy
          value={record.expirationDate ? common.convertDateTime(record.expirationDate, 'DD MMMM, YYYY hh:mm A') : t('shares.quick_shares.expire_options.no_expiration')}
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
        render: (_, record) => <Actions
          item={record}
          onStopSharing={onStopSharing}
        />
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
      scroll={{ x: 1128 }}
    />
  );
}

export default TableData;
