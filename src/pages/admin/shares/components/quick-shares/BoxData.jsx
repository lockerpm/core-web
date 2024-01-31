import React, { useMemo } from "react";
import {
  List,
  Popover
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
} from '../../../../../components';

import CipherName from "../../../vault/components/table/Name";
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
    onStopSharing = () => {},
  } = props;

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('shares.shared_with')}:</p>
        <SharedWith send={record} size={20}/>
      </div>
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('common.type')}:</p>
        {
          t(common.cipherTypeInfo('type', record.cipher.type).name)
        }
      </div>
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('shares.quick_shares.sharing_time')}:</p>
        <TextCopy
          className="text-xs"
          value={common.timeFromNow(record.creationDate)}
        />
      </div>
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('shares.quick_shares.views')}:</p>
        {
          `${record.accessCount}${record.maxAccessCount ? `/${record.maxAccessCount}` : ''} ${t('shares.quick_shares.views')}`
        }
      </div>
      <div className="flex items-center mb-1">
        <p className="font-semibold mr-2">{t('shares.quick_shares.expiration')}:</p>
        <TextCopy
          className="text-xs"
          value={record.expirationDate ? common.convertDateTime(record.expirationDate, 'DD MMMM, YYYY hh:mm A') : 'N/A'}
          align={'center'}
        />
      </div>
    </div>
  }

  return (
    <List
      bordered={false}
      dataSource={data.map((d) => ({ ...d, key: d.id }))}
      className={className}
      loading={loading}
      renderItem={(record) => (
        <List.Item>
          <div key={record.id} className="w-full">
            <div
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <CipherName
                  send={record}
                />
              </div>
              <div className="flex items-center">
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
                  item={record}
                  onStopSharing={onStopSharing}
                />
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

export default BoxData;
