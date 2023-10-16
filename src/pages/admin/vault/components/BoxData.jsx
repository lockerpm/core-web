import React, { useMemo } from "react";
import {
  Collapse,
  Checkbox,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../components';

import Name from "./table/Name";
import Actions from "./table/Actions";

import common from "../../../../utils/common";

import {
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onUpdate = () => {}
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
              <Checkbox className="mr-2"/>
              <Name cipher={record}/>
            </div>
            <Actions
              cipher={record}
              onUpdate={() => onUpdate(record)}
            />
          </div>}
        >
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('common.created_time')}:</p>
            <TextCopy
              value={common.timeFromNow(record.creationDate)}
            />
          </div>
          <div className="flex items-center">
            <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
            <TextCopy
              value={common.timeFromNow(record.revisionDate)}
            />
          </div>
        </Collapse.Panel>)
      }
    </Collapse>
  );
}

export default BoxData;
