import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  List,
  Row,
  Col,
  Button
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import PersonalInfo from './components/account/PersonalInfo'
import Preferences from './components/account/Preferences'
import DangerZone from './components/account/DangerZone'

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import userServices from "../../../services/user";
import global from "../../../config/global";
import storeActions from "../../../store/actions";

const AccountDetails = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.auth.userInfo)
  const locale = useSelector((state) => state.system.locale)

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);
  const [data] = useState([
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
  ]);

  useEffect(() => {
    form.setFieldsValue({
      email: userInfo.email,
      name: userInfo.name,
      language: locale,
      timeout: userInfo.timeout,
      timeout_action: userInfo.timeout_action
    })
  }, [userInfo])

  const handleCancel = () => {
    form.setFieldsValue({
      email: userInfo.email,
      name: userInfo.full_name,
      language: locale,
      timeout: userInfo.timeout,
      timeout_action: userInfo.timeout_action
    })
  }

  const handleUpdateAccount = async (values) => {
    await userServices.update({
      email: userInfo.email,
      name: values.name,
    }).then(() => {
      global.pushSuccess(t('notification.success.account_details.updated'))
      dispatch(storeActions.updateUserInfo({ ...userInfo, ...values }))
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
      <AdminHeader
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
          dataSource={data}
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