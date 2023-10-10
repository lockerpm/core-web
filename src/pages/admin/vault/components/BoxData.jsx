import React, { useMemo } from "react";
import {
  Collapse,
  Space,
  Button,
  Checkbox,
  Tag
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy
} from '../../../../components'

import {
  convertDateTime,
} from '../../../../utils/common'

import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const BoxData = (props) => {
  const { t } = useTranslation();

  const {
    loading = false,
    className = '',
    data = [],
    params = {},
    rowSelection = {},
    onUpdate = () => {},
    onDelete = () => {}
  } = props;

  const boxData = useMemo(() => {
    return data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))
  }, [data])

  return (
    <Collapse
      className={className}
      bordered={true}
      expandIconPosition="end"
      size="small"
      collapsible='icon'
      loading={loading}
    >
      {
        boxData.map((record) => <Collapse.Panel
          key={record.id}
          header={<div
            className="flex align-items justify-between"
          >
            <div className="flex align-items">
              <Checkbox className="mr-2"/>
              <TextCopy
                value={record.secret.key}
              />
            </div>
            {
              <Space size={[8, 8]}>
                <Button
                  icon={<EditOutlined />}
                  type={'link'}
                  size="small"
                  onClick={() => onUpdate(record)}
                ></Button>
                <Button
                  icon={<DeleteOutlined />}
                  type={'link'}
                  size="small"
                  danger
                  onClick={() => onDelete(record)}
                ></Button>
              </Space>
            }
          </div>}
        >
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('secret.value')}:</p>
            <TextCopy
              isPassword
              value={record.secret.value}
            />
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('secret.environment')}:</p>
          </div>
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">{t('common.created_time')}:</p>
            <TextCopy
              value={convertDateTime(record.creationDate)}
            />
          </div>
          <div className="flex items-center">
            <p className="font-semibold mr-2">{t('common.updated_time')}:</p>
            <TextCopy
              value={convertDateTime(record.updatedDate)}
            />
          </div>
        </Collapse.Panel>)
      }
    </Collapse>
  );
}

export default BoxData;
