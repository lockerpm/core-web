import React, { useMemo } from "react";
import {
  List,
  Popover,
  Checkbox,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import components from '../../../../components';

import Name from "./Name";
import Actions from "./Actions";

import common from "../../../../utils/common";

import {
  InfoCircleOutlined
} from "@ant-design/icons";

const ListData = (props) => {
  const {
    TextCopy,
  } = components;
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    selectedRowKeys = [],
    onMove = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    onRestore = () => {},
    onShare = () => {},
    onStopSharing = () => {},
    onPermanentlyDelete = () => {},
    selectionChange = () => {},
    getCheckboxProps = () => {}
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-1">
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
            key={record.id}
            className="flex items-center justify-between w-full"
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
            <div className="ml-2 flex items-center">
              <Popover
                className="cursor-pointer mr-2"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
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
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
