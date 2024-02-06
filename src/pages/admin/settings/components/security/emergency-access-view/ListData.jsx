import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import emergencyAccessComponents from "../../../../../../components/emergency-access";

const { Name, ViewActions } = emergencyAccessComponents;

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
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
            <ViewActions
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
