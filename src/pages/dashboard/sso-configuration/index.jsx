import React, { useEffect, useState } from "react"
import { } from "react-redux"
import { useTranslation } from "react-i18next"

import {
  Form,
  Input,
  Button,
  Space
} from "@lockerpm/design"

import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import commonComponents from "../../../components/common"

import ssoConfigServices from "../../../services/sso-config"

import global from "../../../config/global"
import common from "../../../utils/common"

const { PageHeader } = commonComponents;

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
        form.setFieldsValue(response.sso_provider_options || {

        });
        setIsEditing(common.isEmpty(response))
      })
      .catch((error) => {
        setIsEditing(false)
        global.pushError(error)
        setSSOConfig({})
      })
  }

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      const payload = {
        sso_provider: "oauth2",
        identifier: "vincss_sso",
        enabled: true,
        sso_provider_options: values
      }
      await ssoConfigServices.update(payload)
        .then(() => {
          global.pushSuccess(t("notification.success.sso_configuration.updated"))
        })
        .catch((error) => {
          global.pushError(error)
        })
      setIsEditing(false)
      setCallingAPI(false)
    })
  }

  const handleReset = () => {
    global.confirm(async () => {
      await ssoConfigServices.disable().then(() => {
        getSSOConfig();
        global.pushSuccess(t('notification.success.sso_configuration.reset'))
      }).catch((error) => {
        global.pushError(error)
      })
    }, {
      content: t('sso_configuration.reset_question'),
      okText: t('button.reset'),
      okButtonProps: { danger: true },
    })
  }

  const handleCancel = () => {
    form.setFieldsValue(ssoConfig.sso_provider_options);
    setIsEditing(false)
  }

  return (
    <div className='sso-configuration layout-content'>
      <PageHeader title={t("sso_configuration.title")} subtitle={t("sso_configuration.description")} actions={[]} />
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
          label={t("sso_configuration.oauth_scopes")}
        >
          <Input readOnly placeholder={t("sso_configuration.placeholder.enter_scopes")} value={'openid'}/>
        </Form.Item>
        <Form.Item
          label={t("sso_configuration.redirect_behavior")}
        >
          <Input readOnly value={common.ssoRedirectUri()} />
        </Form.Item>
        <Form.Item
          label={t("sso_configuration.email_claim_types")}
        >
          <Input readOnly placeholder={t("sso_configuration.placeholder.email_claim_types")} value={'mail'}/>
        </Form.Item>
        <Form.Item
          label={t("sso_configuration.name_claim_types")}
        >
          <Input readOnly placeholder={t("sso_configuration.placeholder.name_claim_types")} value={'name'}/>
        </Form.Item>
      </Form>
      <div className='md:w-3/4 lg:w-3/5'>
        <Space className='flex items-center justify-end'>
          {
            isEditing ? <>
              {
                !common.isEmpty(ssoConfig) && <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                >
                  {t("button.cancel")}
                </Button>
              }
              <Button
                type='primary'
                loading={callingAPI}
                onClick={handleSave}
                htmlType='submit'
                icon={<CheckOutlined />}
              >
                {t("button.save")}
              </Button>
            </> : <>
              {
                !common.isEmpty(ssoConfig) && <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  disabled={callingAPI}
                  danger
                  ghost
                  onClick={() => handleReset()}
                >
                  {t('button.reset')}
                </Button>
              }
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              >
                {t("button.edit")}
              </Button>
            </>
          }
        </Space>
      </div>
    </div>
  )
}

export default SSOConfiguration
