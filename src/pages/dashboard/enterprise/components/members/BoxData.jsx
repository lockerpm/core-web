import React, { useMemo } from "react"
import { Collapse, Space, Avatar, Tag } from "@lockerpm/design"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, PasswordStrength, RouterLink } from "../../../../../components"
import Actions from "./Actions"
import Role from "./Role"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

import { } from "@ant-design/icons"

const BoxData = (props) => {
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
                <Avatar shape='square' src={record.avatar} />
                <div className='ml-2'>
                  <RouterLink
                    className={'font-semibold'}
                    label={record.full_name}
                    routerName={global.keys.ENTERPRISE_MEMBER}
                    routerParams={{ enterprise_id: enterpriseId, member_id: record.id }}
                  />
                  <p>{record.email}</p>
                </div>
              </div>
              <Actions
                item={record}
                enterpriseId={enterpriseId}
                onDelete={onDelete}
                onReload={onReload}
              />
            </div>
          }
        >
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.role")}:</p>
            <Role
              record={record}
              enterpriseId={enterpriseId}
              onReload={onReload}
            />
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.status")}:</p>
            {
              (() => {
                const status = common.getStatus(record.status)
                return <Tag color={status.color}>
                  {t(status?.label)}
                </Tag>
              })()
            }
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.group")}:</p>
            <Space size={[4, 4]} wrap>
              {
                record.groups.map((g, index) => <Tag key={index}>
                  {g}
                </Tag>)
              }
            </Space>
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.password")}:</p>
            <PasswordStrength
              score={record.security_score}
              showProgress={false}
            />
          </div>
          <div className='flex items-center mb-2'>
            <p className='font-semibold mr-2'>{t("common.joined_at")}:</p>
            <TextCopy value={common.timeFromNow(record.access_time)} />
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}

export default BoxData
