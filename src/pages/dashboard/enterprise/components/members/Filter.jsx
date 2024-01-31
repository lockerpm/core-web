import React, { useState, useEffect } from "react"
import { Row, Col, Input, Select } from "@lockerpm/design"

import { SearchOutlined } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

const Filter = (props) => {
  const { t } = useTranslation()
  const {
    className = "",
    params = {},
    loading = false,
    activeTab = '',
    setParams = () => { }
  } = props

  const [searchText, setSearchText] = useState(params.searchText)

  useEffect(() => {
    setSearchText(params.searchText)
  }, [params.searchText])

  return (
    <Row className={`filter ${className}`} justify={"space-between"} gutter={[0, 8]}>
      <Col lg={16} span={16} xs={24} className='w-full'>
        <Row justify={"left"} gutter={[12, 12]}>
          <Col lg={8} md={8} sm={12} xs={12}>
            <Input
              prefix={<SearchOutlined />}
              value={searchText}
              disabled={loading}
              placeholder={t("placeholder.search")}
              onChange={(e) => {
                setSearchText(e.target.value)
                setParams({
                  ...params,
                  searchText: e.target.value,
                })
              }}
              onPressEnter={() => setParams({ ...params, searchText })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            <Select
              className='w-full'
              optionFilterProp='children'
              value={params.role}
              onChange={(v) => {
                setParams({
                  ...params,
                  role: v,
                })
              }}
              options={[
                {
                  value: '',
                  label: t('enterprise_members.all_roles'),
                },
                ...global.constants.USER_ROLES.filter((r) => !r.hide).map((r) => ({
                  value: r.value,
                  label: t(r.label)
                }))
              ]}
            />
          </Col>
        </Row>
      </Col>
      <Col lg={8} span={8} className='w-full'>
      </Col>
    </Row>
  )
}

export default Filter
