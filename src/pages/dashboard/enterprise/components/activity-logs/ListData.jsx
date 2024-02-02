import React, { } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import {
  List,
  Popover,
  Avatar
} from "@lockerpm/design"

import {
  InfoCircleOutlined
} from "@ant-design/icons"

import itemsComponents from "../../../../../components/items"

import common from "../../../../../utils/common"
import global from "../../../../../config/global"

const { TextCopy, RouterLink } = itemsComponents;

const ListData = (props) => {
  const {
    loading = false,
    className = "",
    data = [],
    enterpriseId
  } = props

  const { t } = useTranslation()
  const locale = useSelector((state) => state.system.locale)

  const GeneralInfo = (props) => {
    const { record } = props;
    return <div className="text-xs">
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.action")}:</p>
        <div
          className='flex items-center text-limited'
          dangerouslySetInnerHTML={{ __html: record.description[locale]?.replace('<b', '<b style="margin: 0 4px"') }}
        />
      </div>
      <div className='flex items-center mb-1'>
        <p className='font-semibold mr-2'>{t("common.time")}:</p>
        <TextCopy className="text-xs" value={common.convertDateTime(record.creation_date)} />
      </div>
      <div className='flex items-center'>
        <p className='font-semibold mr-2'>{t("common.ip_address")}:</p>
        <TextCopy className="text-xs" value={record.ip_address} />
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
          <div className='flex items-center justify-between w-full'>
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
            <Popover
              className="mr-2 cursor-pointer"
              placement="right"
              trigger="click"
              content={() => <GeneralInfo record={record}/>}
            >
              <InfoCircleOutlined />
            </Popover>
          </div>
        </List.Item>
      )}
    />
  )
}

export default ListData
