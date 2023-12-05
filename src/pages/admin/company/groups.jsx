import React, { useEffect, useState, useMemo } from "react"
import {} from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"

import { AdminHeader } from "../../../components"
import Filter from "./components/groups/Filter"
import NoGroup from "./components/groups/NoGroup"
import TableData from "./components/groups/TableData"
import BoxData from "./components/groups/BoxData"
import FormData from "./components/groups/FormData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import companyGroupService from "../../../services/company-group"

import common from "../../../utils/common"

import global from "../../../config/global"

const CompanyGroups = (props) => {
  const {} = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)
  const isMobile = useSelector((state) => state.system.isMobile)
  const companyId = useSelector((state) => state.company.id)

  const [groups, setGroups] = useState([])
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

  const getAllGroups = async () => {
    setLoading(true)
    await companyGroupService
      .list(companyId)
      .then((response) => {
        setGroups(response.results)
      })
      .catch((error) => {
        global.pushError(error)
      })
    setLoading(false)
  }

  useEffect(() => {
    getAllGroups()
  }, [])

  const isEmpty = useMemo(() => {
    return groups.length === 0
  }, [])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData([...groups], params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [groups, JSON.stringify(params)])

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

  const deleteItem = (group) => {
    global.confirm(async () => {
      companyGroupService
        .remove(companyId, group.id)
        .then(() => {
          global.pushSuccess(t("notification.success.company_groups.deleted"))
          if (filteredData.length === 1 && params.page > 1) {
            setParams({
              ...params,
              page: params.page - 1,
            })
          }
          getAllGroups()
        })
        .catch((error) => {
          global.pushError(error)
        })
    })
  }

  return (
    <div className='company_users layout-content'>
      <AdminHeader
        title={t("company_groups.title")}
        subtitle={t("company_groups.description")}
        actions={[
          {
            key: "add",
            label: t("button.new_group"),
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
        <NoGroup className={"mt-4"} loading={loading} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
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
      <FormData
        visible={formVisible}
        item={selectedItem}
        onReload={getAllGroups}
        onClose={() => setFormVisible(false)}
      />
    </div>
  )
}

export default CompanyGroups
