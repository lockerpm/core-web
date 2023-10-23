import React, { useMemo } from "react";
import {
  Collapse,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../../components';

import CipherName from "../../../vault/components/table/Name";
import Actions from "./table/Actions";
import SharedWith from "./table/SharedWith";

import common from "../../../../../utils/common";

import {
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onStopSharing = () => {},
  } = props;

  const boxData = useMemo(() => {
    return data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))
  }, [data])

  return (
    <Collapse
      className={className}
      bordered={true}
      expandIconPosition="end"
      size="small"
      collapsible='icon'
      loading={loading}
    >
      {
        boxData.map((record) => <Collapse.Panel
          key={record.id}
          header={<div
            className="flex align-items justify-between"
          >
            <div className="flex align-items">
              <CipherName
                send={record}
              />
            </div>
            <Actions
              item={record}
              onStopSharing={onStopSharing}
            />
          </div>}
        >
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('shares.quick_shares.shared_with')}:</p>
            <SharedWith send={record}/>
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('common.type')}:</p>
            {
              common.cipherTypeInfo('type', record.cipher.type).name
            }
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('shares.quick_shares.sharing_time')}:</p>
            <TextCopy
              value={common.timeFromNow(record.creationDate)}
            />
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('shares.quick_shares.views')}:</p>
            {
              `${record.accessCount}${record.maxAccessCount ? `/${record.maxAccessCount}` : ''} ${t('shares.quick_shares.views')}`
            }
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('shares.quick_shares.expiration')}:</p>
            <TextCopy
              value={record.expirationDate ? common.convertDateTime(record.expirationDate, 'DD MMMM, YYYY hh:mm A') : 'N/A'}
              align={'center'}
            />
          </div>
        </Collapse.Panel>)
      }
    </Collapse>
  );
}

export default BoxData;
