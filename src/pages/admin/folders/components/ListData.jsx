import React from "react";

import { } from "react-i18next";

import {
  List,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import folderComponents from "../../../../components/folder";

const ListData = (props) => {
  const { Name, Actions } = folderComponents;
  const {
    loading = false,
    className = '',
    data = [],
    onUpdate = () => {},
    onDelete = () => {},
    onStop = () => {},
    onShare = () => {}
  } = props;

  return (
    <List
      bordered={false}
      dataSource={data}
      className={className}
      loading={loading}
      renderItem={(record) => (
        <List.Item
          style={{ padding: 0 }}
          className="mb-0"
        >
          <div
            className="flex items-center justify-between w-full py-1 h-[52px]"
          >
            <div className="flex items-center flex-1">
              <Name item={record}/>
            </div>
            <div className="flex items-center w-[40px] justify-end">
              <Actions
                item={record}
                className="flex items-center"
                onUpdate={onUpdate}
                onDelete={onDelete}
                onStop={onStop}
                onShare={onShare}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
