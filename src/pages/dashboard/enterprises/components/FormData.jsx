import React, { useState, useEffect } from "react"
import { Form, Space, Button, Drawer, Input } from "@lockerpm/design"

import { } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../config/global"
import enterpriseServices from "../../../../services/enterprise"

function FormData(props) {
  const {
    visible = false,
    item = null,
    onClose = () => { },
    onReload = () => { }
  } = props
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
        await createEnterprise(values)
      } else {
        await editEnterprise(values)
      }
      setCallingAPI(false)
      onClose()
    })
  }

  const createEnterprise = async (values) => {
    await enterpriseServices.create(values).then(() => {
      global.pushSuccess(t('notification.success.enterprise.created'))
      onReload()
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const editEnterprise = async (values) => {
    await enterpriseServices.update(item.id, values).then(() => {
      global.pushSuccess(t('notification.success.enterprise.created'))
      onReload()
    }).catch((error) => {
      global.pushError(error)
    })
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t(`enterprises.${item ? "edit" : "add"}`)}
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
            label={<p className='font-semibold'>{t("enterprises.name")}</p>}
            rules={[global.rules.REQUIRED(t("enterprises.name"))]}
          >
            <Input placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
          <Form.Item
            name={"enterprise_name"}
            className='mb-2'
            label={<p className='font-semibold'>{t("enterprises.subtitle")}</p>}
            rules={[global.rules.REQUIRED(t("enterprises.subtitle"))]}
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
