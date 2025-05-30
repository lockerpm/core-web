import React from "react"
import { } from "react-redux"
import { useTranslation } from "react-i18next"

import {
  Button,
  Spin
} from "@lockerpm/design"

import {
  GroupOutlined
} from "@ant-design/icons"

import itemsComponents from "../../../../../components/items"

const NoEnterprise = (props) => {
  const { NoData } = itemsComponents;
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
              <GroupOutlined className="text-black-500" style={{ fontSize: 48 }} />
              <p className='text-xl font-semibold mt-4'>{t("enterprise_groups.no_data.title")}</p>
              <p className='text-sm mt-2 text-black-500'>
                {t("enterprise_groups.no_data.description")}
              </p>
              <Button className='mt-6' type='primary' ghost onClick={onCreate}>
                {t("enterprise_groups.add")}
              </Button>
            </div> : <NoData />
          }
        </> : <div style={{ minHeight: 100 }} />
      }
    </Spin>
  )
}

export default NoEnterprise
