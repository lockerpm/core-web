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
            <div className='ml-2'>
              <p>{record.name}</p>
            </div>
          </div>
        ),
      },
      {
        title: t("common.created_time"),
        dataIndex: "creationDate",
        key: "creationDate",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.timeFromNow(record.creation_date)} align={"center"} />,
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