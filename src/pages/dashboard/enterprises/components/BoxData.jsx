import React, { useMemo } from "react"
import { List, Avatar, Space, Button, Popover } from "@lockerpm/design"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, RouterLink } from "../../../../components"

import common from "../../../../utils/common"
import global from "../../../../config/global"

import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from "@ant-design/icons"

const BoxData = (props) => {
  const { t } = useTranslation()

  const {
    loading = false,
    className = "",
    data = [],
    params = {},
    onUpdate = () => { },
    onDelete = () => { },
  } = props

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.created_time")}:</p>
        <TextCopy
          className="text-xs"
          value={common.timeFromNow(record.creation_date)}
        />
      </div>
      <div className='flex items-center'>
        <p className='font-semibold mr-1'>{t("common.updated_time")}:</p>
        <TextCopy
          className="text-xs"
          value={common.timeFromNow(record.revision_date || record.creation_date)}
        />
      </div>
      {
        record.description && <div className='flex items-center'>
          <p className='font-semibold mr-2'>{t("common.description")}:</p>
          <TextCopy className="text-xs" value={record.description} />
        </div>
      }
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
          <div className='flex items-center justify-between w-full'>
            <div className="flex items-center">
              <Avatar shape="square" src={record.avatar} />
              <div className="ml-2">
                <RouterLink
                  className={'font-semibold'}
                  label={record.name}
                  routerName={global.keys.ENTERPRISE_DASHBOARD}
                  routerParams={{ enterprise_id: record.id }}
                />
                <p className='text-xs'>{record.enterprise_name}</p>
              </div>
            </div>
            <Space size={[8, 8]}>
              <Popover
                className="mr-2 cursor-pointer"
                placement="right"
                trigger="click"
                content={() => <GeneralInfo record={record}/>}
              >
                <InfoCircleOutlined />
              </Popover>
              <Button type='text' size='small' icon={<EditOutlined />} onClick={() => onUpdate(record)} />
              <Button type='text' size='small' disabled danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
            </Space>
          </div>
        </List.Item>
      )}
    />
  )
}

export default BoxData
