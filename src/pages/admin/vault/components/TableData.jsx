import React, { useMemo } from "react";
import {
  Table,
  Image
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink
} from '../../../../components';

import {
} from "@ant-design/icons";

import CipherIcon from "./CipherIcon";
import Actions from "./Actions";

import common from "../../../../utils/common";
import global from "../../../../config/global";
import ShareIcon from "../../../../assets/images/icons/shares-icon.svg"

const TableData = (props) => {
  const { t } = useTranslation();
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
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
        width: 300,
        align: 'left',
        render: (_, record) => <div className="flex items-center">
          <CipherIcon
            // item={record}
            type={record.type}
          />
          <div className="ml-2 flex-1">
            <div className="flex items-center">
              <RouterLink
                className={'font-semibold'}
                label={record.name}
                routerName={global.keys.VAULT_DETAIL}
                routerParams={{ id: record.id }}
                icon={
                  record.organizationId && (
                    common.isCipherShared(record.organizationId) || common.isCipherSharedWithMe(allOrganizations, record.organizationId)
                  ) ? <Image
                    className="ml-1"
                    preview={false}
                    src={ShareIcon}
                    title={t('inventory.shared')}
                  /> : <></>
                }
              />
            </div>
            <TextCopy
              className="text-sm"
              value={common.cipherSubtitle(allCiphers.find((d) => d.id === record.id))}
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
        columnWidth: 25
      }}
      size="small"
      scroll={{ x: 1024 }}
    />
  );
}

export default TableData;
