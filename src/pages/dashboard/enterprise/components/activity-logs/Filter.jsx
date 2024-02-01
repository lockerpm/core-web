import React, { } from "react"
import { Row, Col, Select, Avatar } from "@lockerpm/design"
import components from "../../../../../components"
import { } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

const Filter = (props) => {
  const { FilterTime } = components;
  const { t } = useTranslation()
  const {
    className = "",
    params = {},
    loading = false,
    members = [],
    setParams = () => { }
  } = props

  return (
    <Row className={`filter ${className}`} justify={"space-between"} gutter={[0, 8]}>
      <Col lg={12} span={12} className='w-full'>
        <Row justify={"left"} gutter={[12, 12]}>
          <Col xl={12} lg={12} md={12} xs={24}>
            <Select
              className="w-full"
              value={params.action}
              disabled={loading}
              allowClear
              placeholder={t('enterprise_activity_logs.all_actions')}
              onChange={(v) => setParams({ ...params, action: v })}
              options={[
                ...global.constants.ACTIVITY_LOG_ACTIONS.map((o) => ({
                  ...o,
                  label: t(o.label)
                }))
              ]}
            />
          </Col>
          <Col xl={12} lg={12} md={12} xs={24}>
            <Select
              className="w-full"
              disabled={loading}
              value={params.acting_member_ids}
              mode="multiple"
              allowClear
              placeholder={t('enterprise_activity_logs.all_users')}
              maxTagCount={1}
              onChange={(v) => setParams({ ...params, acting_member_ids: v })}
              options={[
                ...members.map((m) => ({
                  value: m.id,
                  label: <div className='flex items-center'>
                    <Avatar src={m.avatar} size={24} />
                    <p className='text-xs ml-2'>{m.email}</p>
                  </div>
                }))
              ]}
            />
          </Col>
        </Row>
      </Col>
      <Col lg={12} span={12} className='w-full' align="right">
        <FilterTime
          disabled={loading}
          params={params}
          onChange={(v) => setParams({ ...params, ...v })}
        />
      </Col>
    </Row>
  )
}

export default Filter
