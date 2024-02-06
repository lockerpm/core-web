import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Checkbox,
  Popover
} from '@lockerpm/design';

import {
  InfoCircleOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";
import otpComponents from "../../../../components/otp";

import common from "../../../../utils/common";

const { TextCopy } = itemsComponents;
const { Name, Actions } = otpComponents;

const ListData = (props) => {
  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    selectedRowKeys = [],
    onUpdate = () => {},
    onDelete = () => {},
    selectionChange = () => {},
    getCheckboxProps = () => {}
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-2">
        <p className="font-semibold mr-2">{t('common.created_time')}:</p>
        <TextCopy
          className="text-xs"
          value={common.timeFromNow(record.creationDate)}
        />
      </div>
      <div className="flex items-center">
        <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
        <TextCopy
          className="text-xs"
          value={common.timeFromNow(record.revisionDate)}
        />
      </div>
    </div>
  }

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
            key={record.id}
          >
            <div className="flex items-center">
              <Checkbox
                className="mr-2"
                checked={selectedRowKeys.includes(record.id)}
                disabled={getCheckboxProps(record)?.disabled}
                onChange={(e) => selectionChange(null, record.id, e.target.checked)}
              />
              <Name cipher={record}/>
            </div>
            <div className="flex items-center ml-2">
              <Popover
                className="mr-2 cursor-pointer"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
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