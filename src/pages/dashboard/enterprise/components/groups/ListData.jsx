import React, { } from "react"
import { } from "react-redux"
import { useTranslation } from "react-i18next"

import {
  List,
  Popover,
  Space,
  Button,
  Avatar,
  Tooltip
} from "@lockerpm/design"

import {
  EditOutlined,
  DeleteOutlined,
  UsergroupAddOutlined,
  GroupOutlined,
  InfoCircleOutlined
} from "@ant-design/icons"

import itemsComponents from "../../../../../components/items"

import common from "../../../../../utils/common"

const ListData = (props) => {
  const { TextCopy } = itemsComponents;
  const { t } = useTranslation()

  const {
    loading = false,
    className = "",
    data = [],
    onUpdate = () => { },
    onUsers = () => { },
    onDelete = () => { }
  } = props

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.created_by")}:</p>
        <Tooltip title={record.created_by?.email}>
          <Avatar
            src={record.created_by?.avatar}
            size={20}
          >
            {record.created_by?.email?.slice(0, 1)?.toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.number_members")}:</p>
        <TextCopy className="text-xs" value={`${record.number_members} ${t('common.members')}`} />
      </div>
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.created_time")}:</p>
        <TextCopy className="text-xs" value={common.timeFromNow(record.creation_date)} />
      </div>
      <div className='flex items-center'>
        <p className='font-semibold mr-2'>{t("common.updated_time")}:</p>
        <TextCopy className="text-xs" value={common.timeFromNow(record.revision_date || record.creation_date)} />
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
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center'>
              <div className="flex items-center">
                <GroupOutlined style={{ fontSize: 20 }}/>
                <TextCopy className="font-semibold ml-2" value={record.name} />
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
              <Button type='text' size='small' icon={<UsergroupAddOutlined />} onClick={() => onUsers(record)} />
              <Button type='text' size='small' danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
            </Space>
          </div>
        </List.Item>
      )}
    />
  )
}

export default ListData
