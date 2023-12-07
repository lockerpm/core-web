import React from "react"
import { Button, Spin } from "@lockerpm/design"

import { GroupOutlined } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { NoData } from "../../../../../components"

import { gray } from "@ant-design/colors"

const NoEnterprise = (props) => {
  const { t } = useTranslation()
  const { className = "", loading = false, isEmpty = false, onCreate = () => { } } = props
  return (
    <Spin spinning={loading} style={{ minHeight: 100 }}>
      {!loading && (
        <>
          {isEmpty ? (
            <div className={`text-center ${className}`}>
              <GroupOutlined className="text-gray" style={{ fontSize: 48 }} />
              <p className='text-xl font-semibold mt-4'>{t("enterprise_groups.no_data.title")}</p>
              <p className='text-sm mt-2' style={{ color: gray[1] }}>
                {t("enterprise_groups.no_data.description")}
              </p>
              <Button className='mt-6' type='primary' ghost onClick={onCreate}>
                {t("enterprise_groups.add")}
              </Button>
            </div>
          ) : (
            <NoData />
          )}
        </>
      )}
    </Spin>
  )
}

export default NoEnterprise