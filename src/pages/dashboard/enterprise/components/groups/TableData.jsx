import React, { useMemo } from "react"
import { } from "react-redux"
import { useTranslation } from "react-i18next"

import {
  Table,
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
} from "@ant-design/icons"

import itemsComponents from "../../../../../components/items"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

const TableData = (props) => {
  const { TextCopy } = itemsComponents;
  const { t } = useTranslation()
  const {
    loading = false,
    className = "",
    data = [],
    params = {},
    onUpdate = () => { },
    onUsers = () => { },
    onDelete = () => { }
  } = props

  const columns = useMemo(() => {
    return [
      {
        title: t("common.no"),
        dataIndex: "stt",
        key: "stt",
        align: "center",
        width: 50,
      },
      {
        title: t("common.name"),
        dataIndex: "title",
        key: "name",
        align: "left",
        render: (_, record) => (
          <div className="flex items-center">
            <GroupOutlined style={{ fontSize: 20 }}/>
            <TextCopy className="font-semibold ml-2" value={record.name} />
          </div>
        ),
      },
      {
        title: t("common.created_by"),
        dataIndex: "created_by",
        key: "created_by",
        align: "center",
        width: 120,
        render: (_, record) => (
          <Tooltip title={record.created_by?.email}>
            <Avatar
              src={record.created_by?.avatar}
            >
              {record.created_by?.email?.slice(0, 1)?.toUpperCase()}
            </Avatar>
          </Tooltip>
        ),
      },
      {
        title: t("common.number_members"),
        dataIndex: "numberMembers",
        key: "numberMembers",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={`${record.number_members} ${t('common.members')}`} align={"center"} />,
      },
      {
        title: t("common.created_time"),
        dataIndex: "creationDate",
        key: "creationDate",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.timeFromNow(record.creation_date)} align={"center"} />,
      },
      {
        title: t("common.updated_time"),
        dataIndex: "revisionDate",
        key: "revisionDate",
        align: "center",
        width: 200,
        render: (_, record) => (
          <TextCopy value={common.timeFromNow(record.revision_date || record.creation_date)} align={"center"} />
        ),
      },
      {
        title: t("common.actions"),
        dataIndex: "actions",
        key: "actions",
        align: "right",
        fixed: "right",
        width: 100,
        render: (_, record) => (
          <Space size={[8, 8]}>
            <Button type='text' size='small' icon={<EditOutlined />} onClick={() => onUpdate(record)} />
            <Button type='text' size='small' icon={<UsergroupAddOutlined />} onClick={() => onUsers(record)} />
            <Button type='text' size='small' danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
          </Space>
        ),
      },
    ].filter((c) => !c.hide)
  }, [])
  return (
    <Table
      className={className}
      columns={columns}
      dataSource={data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))}
      loading={loading}
      pagination={false}
      rowKey={(record) => record?.id}
      size='small'
      scroll={{ x: global.constants.MAX_TABLE_WIDTH }}
    />
  )
}

export default TableData
