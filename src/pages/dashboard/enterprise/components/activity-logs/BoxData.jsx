import React, { useMemo } from "react"
import { Collapse, Avatar } from "@lockerpm/design"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, RouterLink } from "../../../../../components"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

import { } from "@ant-design/icons"

const BoxData = (props) => {
  const {
    loading = false,
    className = "",
    data = [],
    params = {},
    enterpriseId
  } = props

  const { t } = useTranslation()
  const locale = useSelector((state) => state.system.locale)

  const boxData = useMemo(() => {
    return data.map((d, index) => ({ ...d, stt: index + 1 + (params.page - 1) * params.size }))
  }, [data])

  return (
    <Collapse
      className={className}
      bordered={true}
      expandIconPosition='end'
      size='small'
      collapsible='icon'
      loading={loading}
    >
      {boxData.map((record) => (
        <Collapse.Panel
          key={record.id}
          header={
            <div className='flex align-items justify-between'>
              <div className='flex items-center'>
                <Avatar src={record.avatar} />
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
            </div>
          }
        >
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.action")}:</p>
            <TextCopy value={record.description[locale]} />
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.time")}:</p>
            <TextCopy value={common.convertDateTime(record.creation_date)} />
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.ip_address")}:</p>
            <TextCopy value={record.ip_address} />
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}

export default BoxData
