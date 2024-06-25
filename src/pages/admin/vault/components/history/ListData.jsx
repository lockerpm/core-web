import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Popover,
  Dropdown,
  Button
} from '@lockerpm/design';

import {
  InfoCircleOutlined,
  EllipsisOutlined
} from "@ant-design/icons";


import itemsComponents from "../../../../../components/items";

import common from "../../../../../utils/common";

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const { t } = useTranslation();

  const {
    className = '',
    data = [],
    onRestore = () => {},
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
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
              <TextCopy
                value={record.password}
                defaultShow={false}
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
              <Dropdown
                menu={{ items: [
                  {
                    key: 'copy',
                    label: t('common.copy'),
                    onClick: () => common.copyToClipboard(record.password)
                  },
                  {
                    key: 'restore',
                    label: t('inventory.actions.restore'),
                    onClick: () => onRestore(record.password)
                  },
                ] }}
                trigger={['click']}
              >
                <Button
                  type="text"
                  size={'small'}
                  icon={<EllipsisOutlined style={{ fontSize: 16 }}/>}
                />
              </Dropdown>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
