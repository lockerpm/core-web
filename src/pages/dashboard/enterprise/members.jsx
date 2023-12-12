import React, { useEffect, useState, useMemo } from "react"
import { } from "@lockerpm/design"
import { PlusOutlined } from "@ant-design/icons"

import { AdminHeader, Pagination } from "../../../components"

import MenuTabs from "./components/members/MenuTabs";
import Filter from "./components/members/Filter"
import TableData from "./components/members/TableData"
import BoxData from "./components/members/BoxData"
import FormData from "./components/members/FormData"
import Review from "./components/members/Review";

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
  const [total, setTotal] = useState(0)
  const [members, setMembers] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [reviewVisible, setReviewVisible] = useState(false);
  const [newMembers, setNewMembers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedTab, setSelectedTab] = useState(currentPage.query?.tab || 'active');
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    searchText: currentPage?.query?.searchText,
    role: '',
  })

  const payload = useMemo(() => {
    const p = {
      page: params.page,
      size: params.size,
      q: params.searchText,
      role: params.role,
      primary_admin: params.role === global.constants.USER_ROLE.PRIMARY_ADMIN ? 1 : '',
      admin: params.role === global.constants.USER_ROLE.ADMIN ? 1 : '',
      member: params.role === global.constants.USER_ROLE.MEMBER ? 1 : '',
    }
    if (selectedTab === 'pending') {
      return {
        ...p,
        is_activated: 1,
        block_login: 0,
        statuses: global.constants.STATUS.CREATED
      }
    }
    if (selectedTab === 'disabled') {
      return {
        ...p,
        is_activated: 0,
        block_login: 0,
        statuses: global.constants.STATUS.ACCESSED
      }
    }
    if (selectedTab === 'blocked') {
      return {
        ...p,
        block_login: 1,
        is_activated: 1,
        statuses: global.constants.STATUS.ACCESSED
      }
    }
    return {
      ...p,
      is_activated: 1,
      block_login: 0,
      statuses: global.constants.STATUS.ACCESSED
    }
  }, [params, selectedTab])

  useEffect(() => {
    getMembers()
  }, [JSON.stringify(params), selectedTab])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: '',
      role: '',
    })
  }, [selectedTab])

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

  const getMembers = async (isCreated = false) => {
    setLoading(true)
    if (isCreated) {
      setSelectedTab('pending')
    }
    await enterpriseMemberServices
      .list(enterpriseId, { ...payload })
      .then((response) => {
        setMembers(response.results)
        setTotal(response.count)
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

  const handleOpenReview = (members = []) => {
    setNewMembers(members);
    setReviewVisible(true)
  }

  const deleteItem = (item) => {
    global.confirm(async () => {
      enterpriseMemberServices
        .remove(enterpriseId, item.id)
        .then(async () => {
          global.pushSuccess(t("notification.success.enterprise_members.deleted"))
          if (members.length === 1 && params.page > 1) {
            setParams({
              ...params,
              page: params.page - 1,
            })
          }
          await getMembers()
        })
        .catch((error) => {
          global.pushError(error)
        })
    })
  }

  return (
    <div
      className='enterprise_members layout-content'
      onScroll={(e) => common.scrollEnd(e, params, total, setParams)}
    >
      <AdminHeader
        title={t("enterprise_members.title")}
        total={total}
        actions={[
          {
            key: "add",
            label: t("enterprise_members.add"),
            type: "primary",
            icon: <PlusOutlined />,
            disabled: loading,
            click: () => handleOpenForm(),
          },
        ]}
      />
      <MenuTabs
        activeTab={selectedTab}
        onChange={(v) => {
          setSelectedTab(v);
          global.navigate(currentPage.name, currentPage.params, { tab: v })
        }}
      />
      <Filter
        params={params}
        loading={loading}
        activeTab={selectedTab}
        setParams={(v) => setParams({ ...v, page: 1 })}
      />
      {
        isMobile ? <BoxData
          className='mt-4'
          loading={loading}
          enterpriseId={enterpriseId}
          data={members}
          params={params}
          onDelete={deleteItem}
          onReload={() => getMembers()}
        /> : <TableData
          className='mt-4'
          loading={loading}
          enterpriseId={enterpriseId}
          data={members}
          params={params}
          onDelete={deleteItem}
          onReload={() => getMembers()}
        />
      }
      {
        total > global.constants.PAGE_SIZE && !isMobile && <Pagination
          params={params}
          total={filteredData.total}
          onChange={handleChangePage}
        />
      }
      <FormData
        visible={formVisible}
        item={selectedItem}
        enterpriseId={enterpriseId}
        onReload={getMembers}
        onReview={handleOpenReview}
        onClose={() => setFormVisible(false)}
      />
      <Review
        visible={reviewVisible}
        members={newMembers}
        onClose={() => setReviewVisible(false)}
      />

    </div>
  )
}

export default EnterpriseMembers
