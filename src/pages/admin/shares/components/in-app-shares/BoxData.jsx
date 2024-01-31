import React, { useMemo } from "react";
import {
  List,
  Popover
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy
} from '../../../../../components';

import CipherName from "../../../vault/components/table/Name";
import FolderName from "../../../folders/components/table/Name";
import Actions from "./table/Actions";
import SharedWith from "./table/SharedWith";

import common from "../../../../../utils/common";

import {
  InfoCircleOutlined
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    isFolder = false,
    onUpdate = () => {},
    onStopSharing = () => {},
  } = props;

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
        <List.Item>
          <div
            key={record.id}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              {
                isFolder ? <FolderName item={record}/> : <CipherName cipher={record}/>
              }
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
                item={record}
                className="flex items-center"
                onUpdate={onUpdate}
                onStopSharing={onStopSharing}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default BoxData;
