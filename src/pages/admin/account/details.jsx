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

import PersonalInfo from './components/details/PersonalInfo'
import UploadAvatar from './components/details/UploadAvatar'
import Security from './components/details/Security'
import DangerZone from './components/details/DangerZone'

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import userServices from "../../../services/user";
import global from "../../../config/global";
import storeActions from "../../../store/actions";

const AccountDetails = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.auth.userInfo)

  const [form] = Form.useForm();
  const [callingAPI, setCallingAPI] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [data, setData] = useState([
    {
      key: 'personal_info',
      title: t('account_details.personal_info'),
    },
    {
      key: 'profile_photo',
      title: t('account_details.profile_photo')
    },
    {
      key: 'security_settings',
      title: t('account_details.security_settings')
    },
    {
      key: 'danger_zone',
      title: t('account_details.danger_zone.title')
    },
  ]);

  useEffect(() => {
    form.setFieldsValue({
      username: userInfo.username,
      full_name: userInfo.full_name,
    })
    setAvatar(userInfo.avatar)
  }, [userInfo])

  const handleCancel = () => {
    form.setFieldsValue({
      username: userInfo.username,
      full_name: userInfo.full_name,
    })
    setAvatar(userInfo.avatar)
  }

  const handleUploadFile = async (values) => {
    await userServices.upload_avatar({
      avatar: avatarFile
    }).then(async (response) => {
      await handleUpdateAccount({
        ...values,
        avatarUrl: response.avatar
      })
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const handleUpdateAccount = async (values) => {
    await userServices.update({
      username: userInfo.username,
      full_name: values.full_name,
      avatar: values.avatarUrl || null
    }).then(() => {
      global.pushSuccess(t('notification.success.account_details.updated'))
      dispatch(storeActions.updateUserInfo({ ...userInfo, ...values, avatar }))
    }).catch((error) => {
      global.pushError(error)
    })
  }

  const handleSaveDetails = () => {
    form.validateFields().then(async (values) => {
      setCallingAPI(true)
      if (avatarFile) {
        await handleUploadFile(values)
      } else {
        await handleUpdateAccount(values)
      }
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
      <Form form={form} layout="vertical">
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
                    index === 0 && <PersonalInfo
                      callingAPI={callingAPI}
                    />
                  }
                  {
                    index === 1 && <UploadAvatar
                      callingAPI={callingAPI}
                      value={avatar}
                      onChange={(v) => setAvatar(v)}
                      onChangeFile={(v) => setAvatarFile(v)}
                    />
                  }
                  {
                    index === 2 && <Security />
                  }
                  {
                    index === 3 && <DangerZone />
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