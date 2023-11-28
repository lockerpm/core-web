import React, { useEffect, useState, useMemo } from "react"
import {} from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"
import { AdminHeader } from "../../../components"

import Filter from "./components/companies/Filter"
import NoCompany from "./components/companies/NoCompany"
import TableData from "./components/companies/TableData"
import BoxData from "./components/companies/BoxData"
import FormData from "./components/companies/FormData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"

import global from "../../../config/global"

import companyService from "../../../services/company"

const Companies = (props) => {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const syncing = useSelector((state) => state.sync.syncing)
  const isMobile = useSelector((state) => state.system.isMobile)

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Test1",
      subtitle: "Test1",
      description: "Test1",
    },
    {
      id: 2,
      name: "Test2",
      subtitle: "Test2",
      description: "Test2",
    },
  ])

  const getAllCompanies = async () => {
    await companyService
      .get_companies()
      .then((response) => {
        setCompanies(response)
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAllCompanies()
  }, [])

  const [formVisible, setFormVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: "revisionDate",
    orderDirection: "desc",
    searchText: currentPage?.query?.searchText,
  })

  const isEmpty = useMemo(() => {
    return companies.length === 0
  }, [])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(companies, params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [companies, JSON.stringify(params)])

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

  const deleteItem = (folder) => {
    global.confirm(async () => {
      try {
        global.pushSuccess(t("notification.success.folder.deleted"))
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1,
          })
        }
      } catch (error) {
        global.pushError(error)
      }
    })
  }

  return (
    <div className='vault layout-content' onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}>
      <AdminHeader
        title={t("companies.title")}
        total={filteredData.total}
        actions={[
          {
            key: "add",
            label: t("button.new_company"),
            type: "primary",
            icon: <PlusOutlined />,
            disabled: syncing,
            click: () => handleOpenForm(),
          },
        ]}
      />
      {!isEmpty && (
        <Filter className={"mt-2"} params={params} loading={syncing} setParams={(v) => setParams({ ...v, page: 1 })} />
      )}
      {filteredData.total == 0 ? (
        <NoCompany className={"mt-4"} loading={syncing} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
      ) : (
        <>
          {isMobile ? (
            <BoxData
              className='mt-4'
              loading={syncing}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            />
          ) : (
            <TableData
              className='mt-4'
              loading={syncing}
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
      <FormData visible={formVisible} item={selectedItem} onClose={() => setFormVisible(false)} />
    </div>
  )
}

export default Companies
