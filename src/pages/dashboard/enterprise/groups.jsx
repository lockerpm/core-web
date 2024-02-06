import React, { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import {
} from "@lockerpm/design"

import {
  PlusOutlined
} from "@ant-design/icons"

import itemsComponents from "../../../components/items"
import commonComponents from "../../../components/common"
import groupsComponents from "./components/groups"

import enterpriseGroupServices from "../../../services/enterprise-group"

import common from "../../../utils/common"
import global from "../../../config/global"

const { PageHeader } = commonComponents;
const { Pagination } = itemsComponents;
const {
  Filter,
  NoGroup,
  FormData,
  FormUsers,
  ListData,
  TableData
} = groupsComponents;

const EnterpriseGroups = (props) => {
  const { } = props
  const { t } = useTranslation()
  const location = useLocation()

  const isMobile = useSelector((state) => state.system.isMobile)

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params.enterprise_id

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [usersVisible, setUsersVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: "revisionDate",
    orderDirection: "desc",
    searchText: currentPage?.query?.searchText,
  })

  useEffect(() => {
    getAllGroups()
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
    return groups.length === 0
  }, [groups])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(groups, params, params.orderField, params.orderDirection, [
      (f) => f.id,
      (f) => (params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || "") : true),
    ])
  }, [groups, JSON.stringify(params)])

  const getAllGroups = async () => {
    setLoading(true)
    await enterpriseGroupServices
      .list(enterpriseId, { paging: 0 })
      .then((response) => {
        setGroups(response)
      })
      .catch((error) => {
        setGroups([])
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

  const handleOpenFormUsers = (item = null) => {
    setSelectedItem(item)
    setUsersVisible(true)
  }

  const deleteItem = (group) => {
    global.confirm(async () => {
      enterpriseGroupServices
        .remove(enterpriseId, group.id)
        .then(() => {
          global.pushSuccess(t("notification.success.enterprise_groups.deleted"))
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
      <PageHeader
        title={t("enterprise_groups.title")}
        total={groups.length}
        actions={[
          {
            key: "add",
            label: t("button.new_group"),
            type: "primary",
            hide: groups.length === 0,
            icon: <PlusOutlined />,
            disabled: loading,
            click: () => handleOpenForm(),
          },
        ]}
      />

      {!isEmpty && (
        <Filter className={"mt-2"} params={params} loading={loading} setParams={(v) => setParams({ ...v, page: 1 })} />
      )}
      {filteredData.total === 0 ? (
        <NoGroup className={"mt-4"} loading={loading} isEmpty={isEmpty} onCreate={() => handleOpenForm()} />
      ) : (
        <>
          {isMobile ? (
            <ListData
              className='mt-4'
              loading={loading}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onUsers={handleOpenFormUsers}
              onDelete={deleteItem}
            />
          ) : (
            <TableData
              className='mt-4'
              loading={loading}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onUsers={handleOpenFormUsers}
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
        onReload={getAllGroups}
        onClose={() => setFormVisible(false)}
      />
      <FormUsers
        visible={usersVisible}
        enterpriseId={enterpriseId}
        item={selectedItem}
        onReload={getAllGroups}
        onClose={() => setUsersVisible(false)}
      />
    </div>
  )
}

export default EnterpriseGroups
