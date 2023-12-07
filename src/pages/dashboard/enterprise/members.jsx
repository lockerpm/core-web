import React, { useEffect, useState, useMemo } from "react"
import { } from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"

import { AdminHeader, Pagination } from "../../../components"
import Filter from "./components/members/Filter"
import NoMember from "./components/members/NoMember"
import TableData from "./components/members/TableData"
import BoxData from "./components/members/BoxData"
import FormData from "./components/members/FormData"

import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"
import global from "../../../config/global"

import enterpriseMemberServices from "../../../services/enterprise-member"

const EnterpriseMembers = (props) => {
  const { } = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const isMobile = useSelector((state) => state.system.isMobile)

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params.enterprise_id

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

  const [members, setMembers] = useState([])

  useEffect(() => {
    getAllMembers()
  }, [])

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

  const isEmpty = useMemo(() => {
    return members.length === 0
  }, [members])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData([...members], params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [members, JSON.stringify(params)])

  const getAllMembers = async () => {
    setLoading(true)
    await enterpriseMemberServices
      .list(enterpriseId, { paging: 0 })
      .then((response) => {
        setMembers(response)
      })
      .catch((error) => {
        setMembers([])
        global.pushError(error)
      })
    setLoading(false)
  }

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

  const deleteItem = (item) => {
    global.confirm(async () => {
      enterpriseMemberServices
        .remove(item.enterprise_id, group.id)
        .then(() => {
          global.pushSuccess(t("notification.success.enterprise_members.deleted"))
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
    <div
      className='enterprise_members layout-content'
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t("enterprise_members.title")}
        total={members.length}
        actions={[
          {
            key: "add",
            label: t("button.new_user"),
            type: "primary",
            hide: members.length === 0,
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
        <NoMember className={"mt-4"} loading={loading} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
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
        <Pagination
          params={params}
          total={filteredData.total}
          onChange={handleChangePage}
        />
      )}
      <FormData
        visible={formVisible}
        item={selectedItem}
        onReload={getAllMembers}
        onClose={() => setFormVisible(false)}
      />
    </div>
  )
}

export default EnterpriseMembers
