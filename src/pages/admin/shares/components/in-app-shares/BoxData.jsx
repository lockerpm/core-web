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
import FolderName from "../../../folders/components/table/Name";
import Actions from "./table/Actions";

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
    isFolder = false,
    onUpdate = () => {},
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
              {
                isFolder ? <FolderName item={record}/> : <CipherName cipher={record}/>
              }
            </div>
            <Actions
              item={record}
              onUpdate={onUpdate}
              onStopSharing={onStopSharing}
            />
          </div>}
        >
          {
            !isFolder && <div className="flex items-center mb-2">
              <p className="font-semibold mr-2">{t('common.type')}:</p>
              <p>
                {common.cipherTypeInfo('type', record.cipher_type || record.type).name}
              </p>
            </div>
          }
          <div className="flex items-center">
            <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
            <TextCopy
              value={record.revisionDate ? common.timeFromNow(record.revisionDate) : common.timeFromNow(record.access_time)}
              align={'center'}
            />
          </div>
        </Collapse.Panel>)
      }
    </Collapse>
  );
}

export default BoxData;
