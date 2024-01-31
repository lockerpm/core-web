import React, { } from "react";
import {
  List,
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

  return (
    <List
      bordered={false}
      dataSource={data}
      className={className}
      loading={loading}
      renderItem={(record) => (
        <List.Item>
          <div
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <Name
                cipher={record}
                allCiphers={allCiphers}
                onReview={onReview}
              />
            </div>
            <Actions
              className="flex items-center"
              cipher={record}
              allCiphers={allCiphers}
            />
          </div>
        </List.Item>
      )}
    />
  );
}

export default BoxData;
