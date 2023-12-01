import React, { useEffect, useState, useMemo } from "react"
import { Form, Input, Button, Row, Col, Space } from "@lockerpm/design"
import {} from "@ant-design/icons"

import { AdminHeader } from "../../../components"

import {} from "react-redux"
import { useTranslation } from "react-i18next"

import {} from "../../../utils/common"

import SSOConfigurationService from "../../../services/sso-config"

import global from "../../../config/global"

const SSOConfiguration = (props) => {
  const {} = props
  const { t } = useTranslation()

  const [form] = Form.useForm()

  const [SSOConfiguration, setSSOConfiguration] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)

  useEffect(() => {
    getSSOConfiguration()
  }, [])

  const getSSOConfiguration = async () => {
    await SSOConfigurationService.get()
      .then((res) => {
        console.log("success", res)
        setSSOConfiguration(res)
      })
      .catch((err) => {
        console.log("error", err)
        setSSOConfiguration({})
      })
  }

  const putSSOConfiguration = async (data) => {
    await SSOConfigurationService.put(data)
      .then(() => {
        global.pushSuccess(t("notification.success.cipher.updated"))
      })
      .catch((err) => {
        global.pushError(err)
      })
  }

  // temporary variable while waiting for API
  const ssoConfigPlaceholder = {
    "oauth-authorization-url": "https://example.com/oauth/authorize",
    "oauth-token-url": "https://example.com/oauth/token",
    "api-url": "https://example.com/api",
    "oauth-appication-id": "1234567890",
    "oauth-application-secret": "1234567890",
    "oauth-scopes": "read write",
  }

  const onReset = () => {
    form.resetFields()
  }

  const handleOnEditButtonClick = () => {
    setIsEditing(true)
  }

  const handleOnSaveButtonClick = () => {
    form.validateFields().then(async (values) => {
      // await putSSOConfiguration(values)
      setIsEditing(false)
    })
  }

  const handleOnCancelButtonClick = () => {
    form.resetFields()
    setIsEditing(false)
  }

  return (
    <div className='sso-configuration layout-content'>
      <AdminHeader title={t("sso_configuration.title")} subtitle={t("sso_configuration.description")} actions={[]} />
      <Form
        form={form}
        layout='vertical'
        className='mt-8 md:w-3/4 lg:w-3/5'
        initialValues={{
          ...ssoConfigPlaceholder,
        }}
      >
        <Form.Item
          name='oauth-authorization-url'
          label={t("sso_configuration.oauth-authorization-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-authorization-url"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='oauth-token-url'
          label={t("sso_configuration.oauth-token-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-token-url"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='api-url'
          label={t("sso_configuration.api-url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.api-url"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='oauth-appication-id'
          label={t("sso_configuration.oauth-appication-id")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-appication-id"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.enter_id")} />
        </Form.Item>
        <Form.Item
          name='oauth-application-secret'
          label={t("sso_configuration.oauth-application-secret")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-application-secret"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.enter_secret")} />
        </Form.Item>
        <Form.Item
          name='oauth-scopes'
          label={t("sso_configuration.oauth-scopes")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth-scopes"))]}
        >
          <Input disabled={callingAPI || !isEditing} placeholder={t("sso_configuration.placeholder.enter_scopes")} />
        </Form.Item>
        <Form.Item>
          <Space className='flex items-center justify-end'>
            {isEditing ? (
              <>
                <Button onClick={onReset}>{t("button.reset")}</Button>
                <Button danger onClick={handleOnCancelButtonClick}>
                  {t("button.cancel")}
                </Button>
                <Button type='primary' onClick={handleOnSaveButtonClick} htmlType='submit'>
                  {t("button.save")}
                </Button>
              </>
            ) : (
              <Button type='primary' onClick={handleOnEditButtonClick}>
                {t("button.edit")}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SSOConfiguration
