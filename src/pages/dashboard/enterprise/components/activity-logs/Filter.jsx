import React, { useState, useEffect } from "react"
import { Row, Col, Select } from "@lockerpm/design"
import { FilterTime } from "../../../../../components"
import { } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

const Filter = (props) => {
  const { t } = useTranslation()
  const {
    className = "",
    params = {},
    loading = false,
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
              onChange={(v) => setParams({ ...params, action: v })}
              options={[
                {
                  label: t('enterprise_activity_logs.all_actions'),
                  value: ''
                },
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
              options={[]}
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
