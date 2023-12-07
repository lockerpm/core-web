import React, { useEffect, useState, useMemo } from "react"
import { } from "@lockerpm/design"
import { } from "@ant-design/icons"

import { AdminHeader, Pagination } from "../../../components"
import Filter from "./components/activity-logs/Filter"
import TableData from "./components/activity-logs/TableData"
import BoxData from "./components/activity-logs/BoxData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import enterpriseActivityServices from "../../../services/enterprise-activity"

import common from "../../../utils/common"
import global from "../../../config/global"

const EnterpriseActivityLogs = (props) => {
  const { } = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params.enterprise_id
  const isMobile = useSelector((state) => state.system.isMobile)

  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    dates: []
  })

  const getAllActivityLogs = async () => {
    setLoading(true)
    await enterpriseActivityServices
      .list(enterpriseId, params)
      .then((response) => {
        setActivityLogs(response.results)
        setTotal(response.count)
      })
      .catch((error) => {
        global.pushError(error)
        setActivityLogs([])
        setTotal(0)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getAllActivityLogs()
  }, [params])

  const isEmpty = useMemo(() => {
    return activityLogs.length === 0
  }, [activityLogs])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText])

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
    <div
      className='enterprise_members layout-content'
      onScroll={(e) => common.scrollEnd(e, params, total, setParams)}
    >
      <AdminHeader
        title={t("enterprise_activity_logs.title")}
        total={total}
      />
      {
        !isEmpty && <Filter
          className={"mt-2"}
          params={params}
          loading={loading}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        isMobile ? <BoxData
          className='mt-4'
          loading={loading}
          data={activityLogs}
          params={params}
        /> : <TableData
          className='mt-4'
          loading={loading}
          data={activityLogs}
          params={params}
        />
      }
      {
        total > global.constants.PAGE_SIZE && !isMobile && <Pagination
          params={params}
          total={total}
          onChange={handleChangePage}
        />
      }
    </div>
  )
}

export default EnterpriseActivityLogs
