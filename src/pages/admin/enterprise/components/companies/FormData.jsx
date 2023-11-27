import React, { useMemo, useState, useRef, useEffect } from "react"
import { Form, Space, Button, Drawer, Input } from "@lockerpm/design"

import {} from "@ant-design/icons"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

function FormData(props) {
  const { visible = false, item = null, onClose = () => {}, callback = () => {} } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [callingAPI, setCallingAPI] = useState(false)

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
        await createCompany(values)
      } else {
        await editCompany(values)
      }
      setCallingAPI(false)
      onClose()
    })
  }

  const createCompany = async (values) => {}

  const editCompany = async (values) => {}

  return (
    <div className={props.className}>
      <Drawer
        title={t(`companies.${item ? "edit" : "add"}`)}
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
            label={<p className='font-semibold'>{t("companies.name")}</p>}
            rules={[global.rules.REQUIRED(t("companies.name"))]}
          >
            <Input placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
          <Form.Item
            name={"subtitle"}
            className='mb-2'
            label={<p className='font-semibold'>{t("companies.subtitle")}</p>}
            rules={[global.rules.REQUIRED(t("companies.subtitle"))]}
          >
            <Input placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
          <Form.Item
            name={"description"}
            className='mb-2'
            label={<p className='font-semibold'>{t("common.description")}</p>}
          >
            <Input.TextArea placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default FormData
