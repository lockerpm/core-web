import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Button,
  Space,
  Spin,
  Form,
  Modal
} from '@lockerpm/design';
import {
  EditOutlined,
  SendOutlined,
  RedoOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import components from "../../../components";

import EmailProvider from "./components/EmailProvider";
import SMTP from "./components/SMTP";
import SendGrid from "./components/SendGrid";
import SendEmailModal from "./components/SendEmail";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import mailConfigServices from "../../../services/mail-config";
import resourceServices from "../../../services/resource";

import common from "../../../utils/common";
import global from "../../../config/global";

const EmailSetting = (props) => {
  const { PageHeader } = components
  const { } = props;
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [mailProviders, setMailProviders] = useState([])
  const [mailConfig, setMailConfig] = useState(null)
  const [editable, setEditable] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [sendVisible, setSendVisible] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchMailProviders(),
      fetchMailConfiguration()
    ])
    setLoading(false);
  }

  const fetchMailProviders = async () => {
    await resourceServices.list_mail_providers().then((response) => {
      setMailProviders(response)
    }).catch(() => {
      setMailProviders([])
    })
  }

  const fetchMailConfiguration = async () => {
    await mailConfigServices.get().then((response) => {
      const config = response && !common.isEmpty(response) ? response : null;
      setSelectedProvider(config?.mail_provider || 'smtp')
      setMailConfig(config)
    }).catch(() => {
      setSelectedProvider('smtp')
      setMailConfig(null)
    })
  }

  useEffect(() => {
    initData();
  }, [mailConfig, selectedProvider])

  const initData = () => {
    if (mailConfig && mailConfig.mail_provider === selectedProvider) {
      setEditable(false)
      const formValues = {
        from_email: mailConfig.from_email,
        from_name: mailConfig.from_name,
      }
      if (selectedProvider === 'smtp') {
        form.setFieldsValue({
          ...formValues,
          provider: 0,
          host: mailConfig.mail_provider_options.smtp_host,
          port: mailConfig.mail_provider_options.smtp_port,
          username: mailConfig.mail_provider_options.smtp_username,
          password: mailConfig.mail_provider_options.smtp_password,
        })
      } else if (selectedProvider === 'sendgrid') {
        form.setFieldsValue({
          ...formValues,
          api_key: mailConfig.mail_provider_options.api_key,
        })
      }
    } else {
      setEditable(true)
      const formValues = {
        from_email: '',
        from_name: 'Locker Password Manager',
      }
      if (selectedProvider === 'smtp') {
        form.setFieldsValue({
          ...formValues,
          provider: 0,
          host: '',
          port: '',
          username: '',
          password: '',
        })
      } else if (selectedProvider === 'sendgrid') {
        form.setFieldsValue({
          ...formValues,
          api_key: '',
        })
      }
    }
  }

  const changeSmptProvider = (v) => {
    const provider = global.constants.SMTP_PROVIDERS[v]
    form.setFieldValue('host', provider.host)
    form.setFieldValue('port', provider.port)
  }

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      let options = {}
      if (selectedProvider === 'smtp') {
        options = {
          smtp_host: values.host,
          smtp_port: values.port,
          smtp_username: values.username,
          smtp_password: values.password
        }
      } else if (selectedProvider === 'sendgrid') {
        options = {
          api_key: values.api_key
        }
      }
      const payload = {
        mail_provider: selectedProvider,
        sending_domain: '',
        from_email: values.from_email,
        from_name: values.from_name,
        mail_provider_options: options
      }
      setCallingAPI(true);
      await mailConfigServices.update(payload).then(async () => {
        global.pushSuccess(t('notification.success.email_settings.updated'))
        await fetchMailConfiguration();
        setCallingAPI(false);
      }).catch((error) => {
        setCallingAPI(false);
        global.pushError(error)
      })
    })
  }

  const handleCancel = () => {
    form.resetFields()
    initData()
  }

  const handleReset = () => {
    Modal.confirm({
      title: t('email_settings.reset.title'),
      icon: <ExclamationCircleOutlined />,
      content: t('email_settings.reset.description'),
      okText: t('button.reset'),
      cancelText: t('button.cancel'),
      okButtonProps: {
        danger: true
      },
      onOk: () => {
        mailConfigServices.remove().then(async () => {
          global.pushSuccess(t('notification.success.email_settings.reset'));
          await fetchMailConfiguration();
        }).catch((error) => {
          global.pushError(error)
        });
      }
    })
  };

  return (
    <div className="email-setting layout-content">
      <Spin spinning={loading}>
        <PageHeader
          title={t('email_settings.title')}
          subtitle={t('email_settings.description')}
          actions={[]}
        />
        <EmailProvider
          className="mt-6"
          mailConfig={mailConfig}
          mailProviders={mailProviders}
          selectedProvider={selectedProvider}
          onSelect={setSelectedProvider}
        />
        {
          selectedProvider && <div className="mt-6">
            <p className="font-semibold text-xl">{t('email_settings.set_up_integration.title')}</p>
            <div className="mt-4">
              <Form
                form={form}
                layout="vertical"
              >
                {
                  selectedProvider === 'smtp' && <SMTP
                    mailConfig={mailConfig}
                    callingAPI={callingAPI}
                    editable={editable}
                    changeProvider={changeSmptProvider}
                  />
                }
                {
                  selectedProvider === 'sendgrid' && <SendGrid
                    mailConfig={mailConfig}
                    callingAPI={callingAPI}
                    editable={editable}
                  />
                }
              </Form>
            </div>
            {
              !loading && <Row gutter={[16, 0]}>
                <Col lg={16} md={24} xs={24} align={'right'}>
                  <Space>
                    {
                      mailConfig && mailConfig.mail_provider === selectedProvider && !editable && <Button
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
                    {
                      mailConfig && mailConfig.mail_provider === selectedProvider && !editable && <Button
                        type="primary"
                        icon={<SendOutlined />}
                        ghost
                        onClick={() => setSendVisible(true)}
                      >
                        {t('button.send_test')}
                      </Button>
                    }
                    {
                      mailConfig && mailConfig.mail_provider === selectedProvider && !editable && <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditable(true)}
                      >
                        {t('button.edit')}
                      </Button>
                    }
                    {
                      editable && <Button
                        onClick={handleCancel}
                        disabled={callingAPI}
                      >
                        {t('button.cancel')}
                      </Button>
                    }
                    {
                      editable && <Button
                        type="primary"
                        loading={callingAPI}
                        onClick={handleSave}
                      >
                        {t('button.save')}
                      </Button>
                    }
                  </Space>
                </Col>
              </Row>
            }
          </div>
        }
      </Spin>
      <SendEmailModal
        visible={sendVisible}
        onClose={() => setSendVisible(false)}
      />
    </div>
  );
}

export default EmailSetting;