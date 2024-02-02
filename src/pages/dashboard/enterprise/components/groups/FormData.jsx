import React, { useState, useEffect } from "react"
import { } from "react-redux"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import {
  Form,
  Space,
  Button,
  Drawer,
  Input
} from "@lockerpm/design"

import { } from "@ant-design/icons"

import enterpriseGroupServices from "../../../../../services/enterprise-group"

import global from "../../../../../config/global"
import common from "../../../../../utils/common"

function FormData(props) {
  const {
    visible = false,
    item = null,
    onClose = () => { },
    onReload = () => { }
  } = props
  const { t } = useTranslation()
  const location = useLocation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false)

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params?.enterprise_id

  useEffect(() => {
    if (visible) {
      if (item?.id) {
        form.setFieldsValue(item)
      } else {
        form.setFieldsValue({ name: "", subtitle: "", description: "" })
      }
    } else {
      form.resetFields()
      setCallingAPI(false)
    }
  }, [visible])

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      if (!item?.id) {
        await createGroup(values)
      } else {
        await editGroup(values)
      }
      setCallingAPI(false)
      onClose()
    })
  }

  const createGroup = async (values) => {
    await enterpriseGroupServices
      .create(enterpriseId, values)
      .then(() => {
        global.pushSuccess(t("notification.success.enterprise_groups.created"))
        onReload()
      })
      .catch((error) => {
        global.pushError(error)
      })
  }

  const editGroup = async (values) => {
    await enterpriseGroupServices
      .update(enterpriseId, item.id, values)
      .then(() => {
        global.pushSuccess(t("notification.success.enterprise_groups.updated"))
        onReload()
      })
      .catch((error) => {
        global.pushError(error)
      })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t(`enterprise_groups.${item ? "edit" : "add"}`)}
        placement='right'
        onClose={onClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button disabled={callingAPI} onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type='primary' loading={callingAPI} onClick={handleSave}>
              {t("button.save")}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout='vertical' labelAlign={"left"}>
          <Form.Item
            name={"name"}
            className='mb-2'
            label={<p className='font-semibold'>{t("enterprise_groups.group_name")}</p>}
            rules={[global.rules.REQUIRED(t("enterprise_groups.group_name"))]}
          >
            <Input placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default FormData
