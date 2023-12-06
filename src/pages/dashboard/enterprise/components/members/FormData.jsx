import React, { useMemo, useState, useRef, useEffect } from "react"
import { Form, Space, Button, Drawer, Input, message, Upload, Select } from "@lockerpm/design"

import { UploadOutlined } from "@ant-design/icons"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import global from "../../../../../config/global"

function FormData(props) {
  const { visible = false, item = null, onClose = () => { }, onReload = () => { } } = props
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
  }

  const editEnterprise = async (values) => {
  }

  const onChange = (value) => {
    console.log(`selected ${value}`)
  }
  const onSearch = (value) => {
    console.log("search:", value)
  }

  const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())

  return (
    <div className={props.className}>
      <Drawer
        title={t(`enterprise_members.${item ? "edit" : "add"}`)}
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
            name={"user_email"}
            className='mb-2'
            label={<p className='font-semibold'>{t("enterprise_members.user_email")}</p>}
            rules={[global.rules.REQUIRED(t("enterprise_members.user_email"))]}
          >
            <Input placeholder={t("placeholder.enter")} disabled={callingAPI} />
          </Form.Item>
          <Form.Item name={"role"} className='mb-2' label={<p className='font-semibold'>{t("enterprise_members.role")}</p>}>
            <Select
              showSearch
              placeholder={t("placeholder.enter")}
              optionFilterProp='children'
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              disabled={callingAPI}
              options={[
                {
                  value: "admin",
                  label: "Admin",
                },
                {
                  value: "user",
                  label: "User",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name={"description"} className='mb-2'>
            <p className='mb-2 mt-4'>{t("enterprise_members.upload_file_guide")}</p>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>{t("enterprise_members.upload_file")}</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default FormData
