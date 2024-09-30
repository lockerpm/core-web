import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Popover,
} from '@lockerpm/design';

import {
  InfoCircleOutlined,
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";
import cipherComponents from "../../../../../components/cipher";

import common from "../../../../../utils/common";

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const { HistoryActions } = cipherComponents;
  const { t } = useTranslation();

  const {
    className = '',
    isRestore = false,
    data = [],
    onRestore = () => {},
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center">
        <p className="font-semibold mr-2">{t('common.last_updated')}:</p>
        <TextCopy
          className="text-xs"
          value={common.convertDateTime(record.lastUsedDate, 'LLL')}
        />
      </div>
    </div>
  }

  return (
    <List
      bordered={false}
      dataSource={data}
      className={className}
      renderItem={(record) => (
        <List.Item
          style={{ padding: 0 }}
          className="mb-0"
        >
          <div
            key={record.id}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center">
              <TextCopy
                value={record.password}
                show={false}
                align="between"
              />
            </div>
            <div className="ml-2 flex items-center">
              <Popover
                className="cursor-pointer mr-2"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
              <HistoryActions
                item={record}
                isRestore={isRestore}
                onRestore={onRestore}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
