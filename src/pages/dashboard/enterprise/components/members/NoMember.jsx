import React from "react"
import { Button, Spin } from "@lockerpm/design"

import { UserOutlined } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import { NoData } from "../../../../../components"

import { gray } from "@ant-design/colors"

const NoMember = (props) => {
  const { t } = useTranslation()
  const {
    className = "",
    loading = false,
    isEmpty = false,
    onCreate = () => { }
  } = props
  return (
    <Spin spinning={loading}>
      {
        !loading ? <>
          {
            isEmpty ? <div className={`text-center ${className}`}>
              <UserOutlined className="text-gray" style={{ fontSize: 48 }} />
              <p className='text-xl font-semibold mt-4'>{t("enterprise_members.no_data.title")}</p>
              <p className='text-sm mt-2' style={{ color: gray[1] }}>
                {t("enterprise_members.no_data.description")}
              </p>
              <Button className='mt-6' type='primary' ghost onClick={onCreate}>
                {t("enterprise_members.add")}
              </Button>
            </div> : <NoData />
          }
        </> : <div style={{ minHeight: 100 }} />
      }
    </Spin>
  )
}

export default NoMember
