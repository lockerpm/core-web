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
        setIsEditing(common.isEmpty(response))
        form.setFieldsValue(response.sso_provider_options);
      })
      .catch((error) => {
        setIsEditing(common.isEmpty(response))
        global.pushError(error)
        setSSOConfig({})
      })
  }

  const handleOnEditButtonClick = () => {
    setIsEditing(true)
  }

  const handleOnSaveButtonClick = () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      const payload = {
        sso_provider: "oauth2",
        identifier: "vincss_sso",
        enabled: true,
        sso_provider_options: {
          ...values,
          authority: 'https://vincss-sso.fido2.vn'
        }
      }
      await ssoConfigServices.update(payload)
        .then(() => {
          global.pushSuccess(t("notification.success.cipher.updated"))
          setIsEditing(false)
        })
        .catch((error) => {
          global.pushError(error)
        })
    })
    setCallingAPI(false)
  }

  const handleOnCancelButtonClick = () => {
    form.setFieldsValue(ssoConfig);
    setIsEditing(false)
  }

  return (
    <div className='sso-configuration layout-content'>
      <AdminHeader title={t("sso_configuration.title")} subtitle={t("sso_configuration.description")} actions={[]} />
      <Form
        form={form}
        layout='vertical'
        className='mt-4 md:w-3/4 lg:w-3/5'
        initialValues={{
          sso_provider: 'oauth2',
          identifier: 'vincss_sso'
        }}
        disabled={callingAPI || !isEditing}
      >
        <Form.Item
          name='authorization_endpoint'
          label={t("sso_configuration.oauth_authorization_url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth_authorization_url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='token_endpoint'
          label={t("sso_configuration.oauth_token_url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth_token_url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='userinfo_endpoint'
          label={t("sso_configuration.api_url")}
          rules={[global.rules.REQUIRED(t("sso_configuration.api_url"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.https")} />
        </Form.Item>
        <Form.Item
          name='client_id'
          label={t("sso_configuration.oauth_client_id")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth_client_id"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_id")} />
        </Form.Item>
        <Form.Item
          name='client_secret'
          label={t("sso_configuration.oauth_client_secret")}
          rules={[global.rules.REQUIRED(t("sso_configuration.oauth_client_secret"))]}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_secret")} />
        </Form.Item>
        <Form.Item
          name='scope'
          label={t("sso_configuration.oauth_scopes")}
        >
          <Input placeholder={t("sso_configuration.placeholder.enter_scopes")} />
        </Form.Item>
        <Form.Item
          name='email_claim_types'
          label={t("sso_configuration.email_claim_types")}
        >
          <Input readOnly placeholder={t("sso_configuration.placeholder.email_claim_types")} />
        </Form.Item>
        <Form.Item
          name='name_claim_types'
          label={t("sso_configuration.name_claim_types")}
        >
          <Input readOnly placeholder={t("sso_configuration.placeholder.name_claim_types")} />
        </Form.Item>
      </Form>
      <div className='md:w-3/4 lg:w-3/5'>
        <Space className='flex items-center justify-end'>
          {
            isEditing ? <>
              {
                !common.isEmpty(ssoConfig) && <Button danger onClick={handleOnCancelButtonClick}>
                  {t("button.cancel")}
                </Button>
              }
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
