import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "@lockerpm/design"
import {} from "@ant-design/icons"

import { AdminHeader } from "../../../components"

import {} from "react-redux"
import { useTranslation } from "react-i18next"

import {} from "../../../utils/common"

const SSOConfiguration = (props) => {
  const {} = props
  const { t } = useTranslation()
  return (
    <div className='sso-configuration layout-content'>
      <AdminHeader title={t("sso_configuration.title")} subtitle={t("sso_configuration.description")} actions={[]} />
    </div>
  )
}

export default SSOConfiguration
