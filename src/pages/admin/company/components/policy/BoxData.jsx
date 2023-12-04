import React, { useMemo } from "react"
import { Collapse, Avatar, Space, Button } from "@lockerpm/design"

import {} from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, RouterLink } from "../../../../../components"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

const BoxData = (props) => {
  const { t } = useTranslation()

  const { loading = false, className = "", data = [], params = {}, onUpdate = () => {}, onDelete = () => {} } = props

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
                <div className='ml-2'>
                  <RouterLink
                    className={"font-semibold"}
                    label={record.name}
                    routerName={global.keys.COMPANY_DASHBOARD}
                    routerParams={{ company_id: record.id }}
                  />
                  <p className='font-semibold'>{record.enterprise_name}</p>
                </div>
              </div>
              <Space size={[8, 8]}>
                <Button type='text' size='small' icon={<EditOutlined />} onClick={() => onUpdate(record)} />
                <Button type='text' size='small' danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
              </Space>
            </div>
          }
        >
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.description")}:</p>
            <TextCopy value={common.timeFromNow(record.description)} />
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.created_time")}:</p>
            <TextCopy value={common.timeFromNow(record.creation_date)} />
          </div>
          <div className='flex items-center'>
            <p className='font-semibold mr-2'>{t("common.updated_time")}:</p>
            <TextCopy value={common.timeFromNow(record.revision_date || record.creation_date)} />
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}

export default BoxData
