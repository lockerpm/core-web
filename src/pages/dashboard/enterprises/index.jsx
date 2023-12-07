import React, { useEffect, useState, useMemo } from "react"
import { } from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"
import { AdminHeader } from "../../../components"

import Filter from "./components/Filter"
import NoEnterprise from "./components/NoEnterprise"
import TableData from "./components/TableData"
import BoxData from "./components/BoxData"
import FormData from "./components/FormData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"
import global from "../../../config/global"

import enterpriseServices from "../../../services/enterprise"

const Enterprises = (props) => {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const isMobile = useSelector((state) => state.system.isMobile)

  const [enterprises, setEnterprises] = useState([])
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: "revisionDate",
    orderDirection: "desc",
    searchText: currentPage?.query?.searchText,
  })

  const getAllEnterprises = async () => {
    setLoading(true)
    await enterpriseServices
      .list()
      .then((response) => {
        setEnterprises(response.results)
      })
      .catch((error) => {
        global.pushError(error)
      })
    setLoading(false)
  }

  useEffect(() => {
    getAllEnterprises()
  }, [])

  const isEmpty = useMemo(() => {
    return enterprises.length === 0
  }, [])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData([...enterprises], params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [enterprises, JSON.stringify(params)])

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

  const handleOpenForm = (item = null) => {
    setSelectedItem(item)
    setFormVisible(true)
  }

  const deleteItem = (enterprise) => {
    global.confirm(async () => {
      enterpriseServices
        .remove(enterprise.id)
        .then(() => {
          global.pushSuccess(t("notification.success.enterprise.deleted"))
          if (filteredData.length === 1 && params.page > 1) {
            setParams({
              ...params,
              page: params.page - 1,
            })
          }
        })
        .catch((error) => {
          global.pushError(error)
        })
    })
  }

  return (
    <div
      className='vault layout-content'
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t("enterprises.title")}
        total={filteredData.total}
        actions={[
          {
            key: "add",
            label: t("button.new_enterprise"),
            type: "primary",
            icon: <PlusOutlined />,
            disabled: loading,
            click: () => handleOpenForm(),
          },
        ]}
      />
      {!isEmpty && (
        <Filter className={"mt-2"} params={params} loading={loading} setParams={(v) => setParams({ ...v, page: 1 })} />
      )}
      {filteredData.total == 0 ? (
        <NoEnterprise className={"mt-4"} loading={loading} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
      ) : (
        <>
          {isMobile ? (
            <BoxData
              className='mt-4'
              loading={loading}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            />
          ) : (
            <TableData
              className='mt-4'
              loading={loading}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            />
          )}
        </>
      )}
      {filteredData.total > global.constants.PAGE_SIZE && !isMobile && (
        <Pagination params={params} total={filteredData.total} onChange={handleChangePage} />
      )}
      <FormData
        visible={formVisible}
        item={selectedItem}
        onReload={getAllEnterprises}
        onClose={() => setFormVisible(false)}
      />
    </div>
  )
}

export default Enterprises
