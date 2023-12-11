import React, { useMemo } from "react"
import { Table, Space, Avatar, Tag } from "@lockerpm/design"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, PasswordStrength } from "../../../../../components"
import Actions from "./Actions"
import Role from "./Role"

import common from "../../../../../utils/common"

const TableData = (props) => {
  const { t } = useTranslation()
  const {
    className = "",
    loading = false,
    enterpriseId,
    data = [],
    params = {},
    onDelete = () => { },
    onReload = () => { }
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
        width: 300,
        render: (_, record) => (
          <div className='flex items-center'>
            <Avatar src={record.avatar} />
            <div className='ml-2'>
              <p className='font-semibold'>{record.full_name}</p>
              <p>{record.email}</p>
            </div>
          </div>
        ),
      },
      {
        title: t("common.role"),
        dataIndex: "role",
        key: "role",
        align: "center",
        width: 160,
        render: (_, record) => <Role
          record={record}
          enterpriseId={enterpriseId}
          onReload={onReload}
        />
      },
      {
        title: t("common.status"),
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 120,
        render: (_, record) => {
          const status = common.getStatus(record.status)
          return <Tag color={status.color}>
            {t(status?.label)}
          </Tag>
        }
      },
      {
        title: t("common.group"),
        dataIndex: "group",
        key: "group",
        align: "center",
        width: 200,
        render: (_, record) => <Space size={[4, 4]} wrap>
          {
            record.groups.map((g, index) => <Tag key={index}>
              {g}
            </Tag>)
          }
        </Space>,
      },
      {
        title: t("common.password"),
        dataIndex: "password_strength",
        key: "password_strength",
        align: "center",
        width: 100,
        render: (_, record) => <PasswordStrength
          score={record.security_score}
          showProgress={false}
        />,
      },
      {
        title: t("common.joined_at"),
        dataIndex: "access_time",
        key: "access_time",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.timeFromNow(record.access_time)} align={"center"} />,
      },
      {
        title: t("common.actions"),
        dataIndex: "actions",
        key: "actions",
        align: "right",
        fixed: "right",
        width: 80,
        render: (_, record) => <Actions
          item={record}
          enterpriseId={enterpriseId}
          onDelete={onDelete}
          onReload={onReload}
        />,
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
