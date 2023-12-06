import React, { useMemo, useState, useEffect } from "react"
import { Row, Col, Input, Dropdown, Select } from "@lockerpm/design"

import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons"

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

  const selectedSortOption = useMemo(() => {
    return global.constants.SORT_OPTIONS.find(
      (o) => o.orderField === params.orderField && o.orderDirection === params.orderDirection
    )
  }, [params])

  const sortMenus = useMemo(() => {
    return global.constants.SORT_OPTIONS.map((o) => ({
      key: o.key,
      label: <p className={o.key === selectedSortOption?.key ? "text-primary" : ""}>{t(o.label)}</p>,
      onClick: () =>
        setParams({
          ...params,
          orderField: o.orderField,
          orderDirection: o.orderDirection,
        }),
    }))
  }, [selectedSortOption, params, locale])

  const onChange = (value) => {
    console.log(`selected ${value}`)
  }
  const onSearch = (value) => {
    console.log("search:", value)
  }

  const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())

  return (
    <Row className={`filter ${className}`} justify={"space-between"} gutter={[0, 8]}>
      <Col lg={12} span={12} className='w-full'>
        <Row justify={"left"} gutter={[12, 12]}>
          <Col xl={12} lg={12} md={12} xs={24}>
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
          <Col xl={8} lg={8} md={8} xs={24}>
            <Select
              className='w-full'
              showSearch
              placeholder='Role'
              optionFilterProp='children'
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={[
                {
                  value: "admin",
                  label: "Admin",
                },
                {
                  value: "user",
                  label: "User",
                },
                {
                  value: "none",
                  label: "None",
                },
              ]}
            />
          </Col>
        </Row>
      </Col>
      <Col lg={12} span={12} className='w-full'>
        <Row justify={"end"} gutter={[12, 12]}>
          <Col>
            <Dropdown.Button
              icon={<CaretDownOutlined />}
              trigger={["click"]}
              disabled={loading}
              menu={{
                items: sortMenus,
                selectedKeys: [],
              }}
            >
              {t("sort_options.sort_by")}
            </Dropdown.Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Filter
