import React, { useState, useEffect } from "react"
import { Row, Col, Select } from "@lockerpm/design"
import { FilterTime } from "../../../../../components"
import { } from "@ant-design/icons"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

const Filter = (props) => {
  const { t } = useTranslation()
  const { className = "", params = {}, loading = false, setParams = () => { } } = props

  const locale = useSelector((state) => state.system.locale)
  const [searchText, setSearchText] = useState(params.searchText)

  useEffect(() => {
    setSearchText(params.searchText)
  }, [params.searchText])

  return (
    <Row className={`filter ${className}`} justify={"space-between"} gutter={[0, 8]}>
      <Col lg={12} span={12} className='w-full'>
        <Row justify={"left"} gutter={[12, 12]}>
          <Col xl={12} lg={12} md={12} xs={24}>
            <Select
              className="w-full"
              options={global.constants.LANGUAGES.map((o) => ({
                ...o,
                label: t(o.label)
              }))}
            />
          </Col>
          <Col xl={12} lg={12} md={12} xs={24}>
            <Select
              className="w-full"
              options={global.constants.LANGUAGES.map((o) => ({
                ...o,
                label: t(o.label)
              }))}
            />
          </Col>
        </Row>
      </Col>
      <Col lg={12} span={12} className='w-full'>
        <FilterTime
          params={params}
          onChange={() => { }}
        />
      </Col>
    </Row>
  )
}

export default Filter
