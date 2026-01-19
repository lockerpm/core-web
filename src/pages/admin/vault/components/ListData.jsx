import React from "react";

import {
  List,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";
import cipherComponents from "../../../../components/cipher";

const ListData = (props) => {
  const { Name, Actions } = cipherComponents;

  const {
    loading = false,
    className = '',
    data = [],
    onMove = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    onRestore = () => {},
    onShare = () => {},
    onStopSharing = () => {},
    onPermanentlyDelete = () => {},
    onAttachment = () => {},
    onDetail = () => {}
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
            className="flex items-center justify-between w-full py-1 h-[52px]"
          >
            <div className="flex items-center" style={{ width: 'calc(100% - 120px)'}}>
              <Name
                cipher={record}
                onClick={() => onDetail(record)}
              />
            </div>
            <div className="ml-2 flex items-center w-[112px] justify-end">
              <Actions
                className="flex items-center"
                cipher={record}
                onMove={onMove}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onRestore={onRestore}
                onShare={onShare}
                onStopSharing={onStopSharing}
                onPermanentlyDelete={onPermanentlyDelete}
                onAttachment={onAttachment}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
