import React, { } from "react";

import {
  List,
  // Popover
} from '@lockerpm/design';

import {
  // InfoCircleOutlined
} from "@ant-design/icons";

import otpComponents from "../../../../components/otp";

const ListData = (props) => {
  const { Name, Actions } = otpComponents;
  const {
    loading = false,
    className = '',
    data = [],
    onUpdate = () => {},
    onDelete = () => {},
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
            key={record.id}
            className="flex items-center justify-between w-full py-1"
          >
            <div
              className="flex items-center"
              style={{ width: 'calc(100% - 64px)' }}
            >
              <Name
                cipher={record}
                className={'w-full'}
              />
            </div>
            <div className="flex items-center ml-2 w-[64px] justify-end">
              <Actions
                className="flex items-center"
                cipher={record}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
