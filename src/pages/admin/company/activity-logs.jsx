import React, { useEffect, useState, useMemo } from "react"
import {} from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"

import { AdminHeader } from "../../../components"
import Filter from "./components/activity-logs/Filter"
import TableData from "./components/activity-logs/TableData"
import BoxData from "./components/activity-logs/BoxData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"

import global from "../../../config/global"

const CompanyActivityLogs = (props) => {
  const {} = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const syncing = useSelector((state) => state.sync.syncing)
  const isMobile = useSelector((state) => state.system.isMobile)

  const [activityLogs, setActivityLogs] = useState([
    {
      id: 1,
      name: "Activity Log 1",
      description: "Log description 1",
    },
    {
      id: 2,
      name: "Activity Log 2",
      description: "Log description 2",
    },
  ])

  const getAllActivityLogs = async () => {}

  useEffect(() => {
    getAllActivityLogs()
  }, [])

  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: "revisionDate",
    orderDirection: "desc",
    searchText: currentPage?.query?.searchText,
  })

  const isEmpty = useMemo(() => {
    return activityLogs.length === 0
  }, [])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData([...activityLogs], params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [activityLogs, JSON.stringify(params)])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      size: global.constants.PAGE_SIZE,
    })
  }, [isMobile])

  const handleChangePage = (page, size) => {
    setParams({
      ...params,
      page,
      size,
    })
  }

  return (
    <div className='company_users layout-content'>
      <AdminHeader title={t("company_activity_logs.title")} subtitle={t("company_activity_logs.description")} />

      {!isEmpty && (
        <Filter className={"mt-2"} params={params} loading={syncing} setParams={(v) => setParams({ ...v, page: 1 })} />
      )}
      {isMobile ? (
        <BoxData className='mt-4' loading={syncing} data={filteredData.result} params={params} />
      ) : (
        <TableData className='mt-4' loading={syncing} data={filteredData.result} params={params} />
      )}
    </div>
  )
}

export default CompanyActivityLogs
