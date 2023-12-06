import React, { useEffect, useState, useMemo } from "react"
import { } from "@lockerpm/design"
import { } from "@ant-design/icons"

import { AdminHeader } from "../../../components"

import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import common from "../../../utils/common"

const EnterprisePolicies = (props) => {
  const { } = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentPage = common.getRouterByLocation(location)

  const getPolicies = async () => { }

  useEffect(() => {
    getPolicies()
  }, [])

  return (
    <div className='enterprise_members layout-content'>
      <AdminHeader
        title={t("enterprise_policies.title")}
        actions={[]}
      />
    </div>
  )
}

export default EnterprisePolicies
