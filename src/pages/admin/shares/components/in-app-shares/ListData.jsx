import React from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  List,
  Popover,
  Tag
} from '@lockerpm/design';

import {
  InfoCircleOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../../components/items";
import cipherComponents from "../../../../../components/cipher";
import folderComponents from "../../../../../components/folder";
import inAppShareComponents from "../../../../../components/in-app-share";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const { Actions, SharedWith } = inAppShareComponents;
  const CipherName = cipherComponents.Name;
  const FolderName = folderComponents.Name;

  const { t } = useTranslation();
  const {
    loading = false,
    className = '',
    data = [],
    isFolder = false,
    onUpdate = () => {},
    onStopSharing = () => {},
    onDetail = () => {}
  } = props;

  const myShares = useSelector((state) => state.share.myShares);

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('shares.shared_with')}:</p>
        <SharedWith cipher={record} size={20}/>
      </div>
      {
        !isFolder && <div className="flex items-center mb-1">
          <p className="font-semibold mr-2">{t('common.type')}:</p>
          <p>
            {t(common.cipherTypeInfo('type', record.cipher_type || record.type).name)}
          </p>
        </div>
      }
      <div className="flex items-center">
        <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
        <TextCopy
          className="text-xs"
          value={record.revisionDate ? common.timeFromNow(record.revisionDate) : common.timeFromNow(record.access_time)}
          align={'center'}
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
        <List.Item
          style={{ padding: 0 }}
          className="mb-0"
        >
          <div
            key={record.id}
            className="flex items-center justify-between w-full py-1 h-[52px]"
          >
            <div className="flex items-center flex-1">
              {
                isFolder ? <FolderName
                  item={record}
                /> : <CipherName
                  cipher={record}
                  onClick={() => onDetail(record)}
                />
              }
            </div>
            <div className="ml-2 flex items-center w-[112px] justify-end gap-4">
              <Popover
                className="cursor-pointer"
                placement="top"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
              {
                (() => {
                  let status = <></>
                    const share = myShares.find(s => s.id === record.organizationId) || { members: [], groups: [] }
                    const confirmMember = share.members.find((m) => m.status === global.constants.STATUS.ACCEPTED);
                    if (confirmMember) {
                      status = <Tag color="warning">
                        {t('common.confirm_required')}
                      </Tag>
                    }
                    return <div className="flex items-center gap-2 justify-end">
                      {status}
                      <Actions
                        item={record}
                        className="flex items-center"
                        onUpdate={onUpdate}
                        onStopSharing={onStopSharing}
                      />
                    </div>
                })()
              }
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default ListData;
