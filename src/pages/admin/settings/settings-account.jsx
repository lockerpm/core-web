import React, { useEffect, useState } from "react";
import {
  Form,
  List,
  Row,
  Col,
  Button
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import components from "../../../components";

import PersonalInfo from './components/account/PersonalInfo'
import Preferences from './components/account/Preferences'
import DangerZone from './components/account/DangerZone'

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import userServices from "../../../services/user";

import global from "../../../config/global";
import commonServices from "../../../services/common";

const AccountDetails = (props) => {
  const { PageHeader } = components;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.auth.userInfo)

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      email: userInfo.email,
      name: userInfo.name,
      language: userInfo.language,
      timeout: userInfo.timeout,
    })
  }, [userInfo])

  const handleCancel = () => {
    form.setFieldsValue({
      email: userInfo.email,
      name: userInfo.name,
      language: userInfo.language,
      timeout: userInfo.timeout,
    })
  }

  const handleUpdateAccount = async (values) => {
    await userServices.update_users_me({
      email: userInfo.email,
      full_name: values.name,
      language: values.language,
      timeout: values.timeout
    }).then(() => {
      commonServices.fetch_user_info();
      global.pushSuccess(t('notification.success.account_details.updated'));
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const handleSaveDetails = () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      await handleUpdateAccount(values)
      setCallingAPI(false)
    })
  }

  return (
    <div className="account-details layout-content">
      <PageHeader
        title={t('account_details.title')}
        subtitle={t('account_details.description')}
        actions={[]}
      />
      <Form
        form={form}
        layout="vertical"
        disabled={callingAPI}
      >
        <List
          itemLayout="horizontal"
          dataSource={
            [
              {
                key: 'personal_info',
                title: t('account_details.personal_info'),
              },
              {
                key: 'preferences',
                title: t('account_details.preferences.title')
              },
              {
                key: 'danger_zone',
                title: t('account_details.danger_zone.title')
              },
            ]
          }
          footer={<div className="flex justify-end">
            <Button
              className="mr-2"
              disabled={callingAPI}
              onClick={handleCancel}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={handleSaveDetails}
            >
              {t('button.save_changes')}
            </Button>
          </div>}
          renderItem={(item, index) => (
            <List.Item>
              <Row className="w-full">
                <Col lg={8} md={8} sm={24} xs={24}>
                  <p className="text-lg font-semibold mb-2">
                    {item.title}
                  </p>
                </Col>
                <Col lg={16} md={16} sm={24} xs={24}>
                  {
                    index === 0 && <PersonalInfo />
                  }
                  {
                    index === 1 && <Preferences />
                  }
                  {
                    index === 2 && <DangerZone />
                  }
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Form>
    </div>
  );
}

export default AccountDetails;