import React, { useMemo } from "react"
import { Table, Avatar } from "@lockerpm/design"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import components from "../../../../../components"

import { } from "@ant-design/icons"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

const TableData = (props) => {
  const { TextCopy, RouterLink } = components;
  const { t } = useTranslation()
  const {
    loading = false,
    className = "",
    data = [],
    params = {},
    enterpriseId
  } = props

  const locale = useSelector((state) => state.system.locale)

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
        title: t("common.user"),
        dataIndex: "title",
        key: "name",
        align: "left",
        width: 350,
        render: (_, record) => (
          <div className='flex items-center'>
            <Avatar src={record.user?.avatar} />
            <div className='ml-2'>
              <RouterLink
                className={"font-semibold"}
                label={record.user?.name || record.user?.email}
                routerName={global.keys.ENTERPRISE_MEMBER}
                routerParams={{ enterprise_id: enterpriseId, member_id: record.id }}
              />
              <p className='text-xs'>{record.user?.email}</p>
            </div>
          </div>
        ),
      },
      {
        title: t("common.action"),
        dataIndex: "action",
        key: "action",
        align: "left",
        render: (_, record) => (
          <div
            className='flex items-center text-limited'
            dangerouslySetInnerHTML={{ __html: record.description[locale]?.replace('<b', '<b style="margin: 0 4px"') }}
          />
        ),
      },
      {
        title: t("common.time"),
        dataIndex: "creationDate",
        key: "creationDate",
        align: "center",
        width: 200,
        render: (_, record) => <TextCopy value={common.convertDateTime(record.creation_date)} align={"center"} />,
      },
      {
        title: t("common.ip_address"),
        dataIndex: "ip_address",
        key: "ip_address",
        align: "left",
        width: 150,
        render: (_, record) => <TextCopy value={record.ip_address} />,
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
