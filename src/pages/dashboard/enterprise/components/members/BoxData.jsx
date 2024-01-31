import React, { } from "react"
import { List, Popover, Space, Avatar, Tag } from "@lockerpm/design"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { TextCopy, PasswordStrength, RouterLink } from "../../../../../components"
import Actions from "./Actions"
import Role from "./Role"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

import { InfoCircleOutlined } from "@ant-design/icons"

const BoxData = (props) => {
  const { t } = useTranslation()
  const {
    className = "",
    loading = false,
    enterpriseId,
    data = [],
    onDelete = () => { },
    onReload = () => { }
  } = props

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.role")}:</p>
        <Role
          className="text-xs w-full"
          record={record}
          enterpriseId={enterpriseId}
          onReload={onReload}
        />
      </div>
      <div className='flex items-center mb-1'>
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
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.group")}:</p>
        <Space size={[4, 4]} wrap>
          {
            record.groups.map((g, index) => <Tag key={index}>
              {g}
            </Tag>)
          }
        </Space>
      </div>
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.password")}:</p>
        <PasswordStrength
          className="text-xs"
          score={record.security_score}
          showProgress={false}
        />
      </div>
      <div className='flex items-center'>
        <p className='font-semibold mr-2'>{t("common.joined_at")}:</p>
        <TextCopy className="text-xs" value={common.timeFromNow(record.access_time)} />
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
          <div key={record.id} className="w-full">
            <div
              className="flex items-center justify-between w-full"
            >
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
              <div className="flex items-center">
                <Popover
                  className="mr-2 cursor-pointer"
                  placement="right"
                  trigger="click"
                  content={() => <GeneralInfo record={record}/>}
                >
                  <InfoCircleOutlined />
                </Popover>
                <Actions
                  className="flex items-center"
                  item={record}
                  enterpriseId={enterpriseId}
                  onDelete={onDelete}
                  onReload={onReload}
                />
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}

export default BoxData
