import React, { } from "react";
import {
  List,
  Popover
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../components';

import Name from "./table/Name";
import Actions from "./table/Actions";

import common from "../../../../utils/common";

import {
  InfoCircleOutlined
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    onUpdate = () => {},
    onDelete = () => {},
    onStop = () => {},
    onShare = () => {}
  } = props;

  const GeneralInfo = (props) => {
    const {record} = props;
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
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <Name item={record}/>
            </div>
            <div className="flex items-center">
              <Popover
                className="mr-2 cursor-pointer"
                placement="left"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
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

export default BoxData;
