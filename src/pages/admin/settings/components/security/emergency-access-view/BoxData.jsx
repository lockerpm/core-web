import React, { useMemo } from "react";
import {
  Collapse,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import Name from "./table/Name";
import Actions from "./table/Actions";

import {
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    allCiphers = [],
    onReview = () => {}
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
              <Name
                cipher={record}
                allCiphers={allCiphers}
                onReview={onReview}
              />
            </div>
            <Actions
              cipher={record}
              allCiphers={allCiphers}
            />
          </div>}
        />)
      }
    </Collapse>
  );
}

export default BoxData;
