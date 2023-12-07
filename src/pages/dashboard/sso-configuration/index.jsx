import React, { useEffect, useState, useMemo } from "react"
import { Form, Input, Button, Row, Col, Space } from "@lockerpm/design"
import { } from "@ant-design/icons"

import { AdminHeader } from "../../../components"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

import ssoConfigServices from "../../../services/sso-config"

import global from "../../../config/global"
import common from "../../../utils/common"

const SSOConfiguration = (props) => {
  const { } = props
  const { t } = useTranslation()

  const [form] = Form.useForm()

  const [ssoConfig, setSSOConfig] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  useEffect(() => {
    getSSOConfig()
  }, [])

  const getSSOConfig = async () => {
    await ssoConfigServices.get()
      .then((response) => {
        setSSOConfig(response);
        form.setFieldsValue(response);
      })
      .catch((error) => {
        global.pushError(error)
        setSSOConfig({})
      })
  }

  const handleOnEditButtonClick = () => {
    setIsEditing(true)
  }

  const handleOnSaveButtonClick = () => {
    form.validateFields().then(async (values) => {
      await ssoConfigServices.put(values)
        .then(() => {
          global.pushSuccess(t("notification.success.cipher.updated"))
        })
        .catch((error) => {
          global.pushError(error)
        })
      setIsEditing(false)
    })
  }

  const handleOnCancelButtonClick = () => {
    form.resetFields();
    form.setFieldsValue(ssoConfig);
    setIsEditing(false)
  }

  return (
    <div className='sso-configuration layout-content'>
      <AdminHeader title={t("sso_configuration.title")} subtitle={t("sso_configuration.description")} actions={[]} />
      <Form
        form={form}
        layout='vertical'
        className='mt-8 md:w-3/4 lg:w-3/5'
        disabled={callingAPI || !isEditing}
      >
        <Form.Item
          name='oauth-authorization-url'
          label={t("sso_configuration.oauth-authorization-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-authorization-url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='oauth-token-url'
          label={t("sso_configuration.oauth-token-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-token-url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='api-url'
          label={t("sso_configuration.api-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.api-url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='oauth-appication-id'
          label={t("sso_configuration.oauth-appication-id")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-appication-id"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_id")} />
        </Form.Item>
        <Form.Item
          name='oauth-application-secret'
          label={t("sso_configuration.oauth-application-secret")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-application-secret"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_secret")} />
        </Form.Item>
        <Form.Item
          name='oauth-scopes'
          label={t("sso_configuration.oauth-scopes")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-scopes"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_scopes")} />
        </Form.Item>
      </Form>
      <div className='md:w-3/4 lg:w-3/5'>
        <Space className='flex items-center justify-end'>
          {
            isEditing ? <>
              <Button danger onClick={handleOnCancelButtonClick}>
                {t("button.cancel")}
              </Button>
              <Button type='primary' onClick={handleOnSaveButtonClick} htmlType='submit'>
                {t("button.save")}
              </Button>
            </> : <Button type='primary' onClick={handleOnEditButtonClick}>
              {t("button.edit")}
            </Button>
          }
        </Space>
      </div>
    </div>
  )
}

export default SSOConfiguration
