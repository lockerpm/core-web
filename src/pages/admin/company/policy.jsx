import React, { useEffect, useState, useMemo } from "react"
import {} from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"

import { AdminHeader } from "../../../components"
import Filter from "./components/policy/Filter"
import NoPolicy from "./components/policy/NoPolicy"
import TableData from "./components/policy/TableData"
import BoxData from "./components/policy/BoxData"
import FormData from "./components/policy/FormData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"

import global from "../../../config/global"

const CompanyPolicy = (props) => {
  const {} = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const syncing = useSelector((state) => state.sync.syncing)
  const isMobile = useSelector((state) => state.system.isMobile)

  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "Policy 1",
      description: "Policy description 1",
      status: "Active",
    },
    {
      id: 2,
      name: "Policy 2",
      description: "Policy description 2",
      status: "Inactive",
    },
  ])

  const getAllPolicies = async () => {}

  useEffect(() => {
    getAllPolicies()
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
    return policies.length === 0
  }, [])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData([...policies], params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [policies, JSON.stringify(params)])

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

  const deleteItem = (item) => {}

  return (
    <div className='company_users layout-content'>
      <AdminHeader
        title={t("company_policy.title")}
        subtitle={t("company_policy.description")}
        actions={[
          {
            key: "add",
            label: t("button.new_user"),
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
        <NoPolicy className={"mt-4"} loading={syncing} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
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
      <FormData
        visible={formVisible}
        item={selectedItem}
        onReload={getAllPolicies}
        onClose={() => setFormVisible(false)}
      />
    </div>
  )
}

export default CompanyPolicy
