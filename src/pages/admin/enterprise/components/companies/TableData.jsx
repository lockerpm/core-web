import React, { useMemo } from "react"
import { Table, Space, Button } from "@lockerpm/design"

import {} from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy } from "../../../../../components"

import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

import common from "../../../../../utils/common"

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
          <div>
            <p className='font-semibold'>{record.name}</p>
            <p className='mt-1'>{record.description}</p>
          </div>
        ),
      },
      {
        title: t("common.created_time"),
        dataIndex: "creationDate",
        key: "creationDate",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.timeFromNow(record.creationDate)} align={"center"} />,
      },
      {
        title: t("common.updated_time"),
        dataIndex: "revisionDate",
        key: "revisionDate",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.timeFromNow(record.revisionDate)} align={"center"} />,
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
