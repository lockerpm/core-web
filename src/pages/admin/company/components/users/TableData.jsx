import React, { useMemo } from "react"
import { Table, Space, Button, Avatar } from "@lockerpm/design"

import {} from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, RouterLink } from "../../../../../components"

import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

const TableData = (props) => {
  const { t } = useTranslation()
  const { loading = false, className = "", data = [], params = {}, onUpdate = () => {}, onDelete = () => {} } = props

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
          <div className='flex items-center'>
            <Avatar shape='square' src={record.avatar} />
            <div className='ml-2'>
              <RouterLink
                className={"font-semibold"}
                label={record.name}
                routerName={global.keys.COMPANY_DASHBOARD}
                routerParams={{ company_id: record.id }}
              />
              <p className='mt-1'>{record.email}</p>
            </div>
          </div>
        ),
      },
      {
        title: t("common.role"),
        dataIndex: "role",
        key: "role",
        align: "center",
        width: 100,
        render: (_, record) => <TextCopy value={record.role} align={"center"} />,
      },
      {
        title: t("common.status"),
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 100,
        render: (_, record) => <TextCopy value={record.status} align={"center"} />,
      },
      {
        title: t("common.group"),
        dataIndex: "group",
        key: "group",
        align: "center",
        width: 100,
        render: (_, record) => <TextCopy value={record.group} align={"center"} />,
      },
      {
        title: t("common.password"),
        dataIndex: "password_strength",
        key: "password_strength",
        align: "center",
        width: 100,
        render: (_, record) => <TextCopy value={record.password_strength} align={"center"} />,
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
        title: t("common.actions"),
        dataIndex: "actions",
        key: "actions",
        align: "right",
        fixed: "right",
        width: 100,
        render: (_, record) => (
          <Space size={[8, 8]}>
            <Button type='text' size='small' icon={<EditOutlined />} onClick={() => onUpdate(record)} />
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
      scroll={{ x: 1024 }}
    />
  )
}

export default TableData
