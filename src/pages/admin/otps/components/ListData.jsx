import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  // Popover
} from '@lockerpm/design';

import {
  // InfoCircleOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";
import otpComponents from "../../../../components/otp";

import common from "../../../../utils/common";

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const { Name, Actions } = otpComponents;
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    onUpdate = () => {},
    onDelete = () => {},
  } = props;

  // const GeneralInfo = (props) => {
  //   const { record } = props;
  //   return <div className="text-xs">
  //     <div className="flex items-center mb-2">
  //       <p className="font-semibold mr-2">{t('common.created_time')}:</p>
  //       <TextCopy
  //         className="text-xs"
  //         value={common.timeFromNow(record.creationDate)}
  //       />
  //     </div>
  //     <div className="flex items-center">
  //       <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
  //       <TextCopy
  //         className="text-xs"
  //         value={common.timeFromNow(record.revisionDate)}
  //       />
  //     </div>
  //   </div>
  // }

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
            <div className="flex items-center" style={{ width: 'calc(100% - 64px)' }}>
              <Name
                cipher={record}
                className={'w-full'}
              />
            </div>
            <div className="flex items-center ml-2 w-[64px] justify-end">
              {/* <Popover
                className="mr-2 cursor-pointer"
                placement="top"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover> */}
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
