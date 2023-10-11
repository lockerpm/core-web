import React, { useEffect, useState } from "react";
import './css/index.scss';

import {
  Image,
  Card,
  Input,
  Form,
  Button,
  Avatar,
  Row,
  Col
} from '@lockerpm/design';

import AuthLogo from '../../assets/images/logos/auth-logo.svg';
import AuthBgImage from "../../assets/images/auth-bg-image.svg";

import RULES from '../../config/rules'

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

import storeActions from "../../store/actions";

import syncServices from "../../secrets-web/src/services/sync";
import coreServices from "../../secrets-web/src/services/core";
import authServices from "../../services/auth";
import global from "../../secrets-web/src/config/global";

import common from "../../utils/common";

const CreateMasterPassword = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [callingAPI, setCallingAPI] = useState(false);
  const [logging, setLogging] = useState(false);
  const [form] = Form.useForm();

  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const query = common.convertStringToQuery(window.location.search);

  const handleCreateMasterPassword = async () => {
    setCallingAPI(true)
    setCallingAPI(false)
  }

  const handleLogout = async () => {
    setLogging(true);
    await authServices.logout();
    setLogging(false);
  }

  return (
    <div
      className="lock-page"
    >
      <div
        className="w-[600px]"
        style={{
          backgroundImage: `url(${AuthBgImage})`,
          backgroundSize: 'contain',
          paddingTop: 62,
          height: 'max-content'
        }}
      >
        <div className="flex items-center justify-center mb-8">
          <Image
            className='icon-logo'
            src={AuthLogo}
            preview={false}
            height={48}
          />
        </div>
        <div className="flex items-center justify-center">
          <Card
            className="w-[430px]"
            bodyStyle={{
              padding: '32px'
            }}
          >
            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-semibold">
                { t('create_master_password.title') }
              </p>
            </div>
            <p className="mb-6 mt-2">{t('create_master_password.description')}</p>
            <Form
              form={form}
              key={locale}
            >
              <Form.Item>
                <Input
                  placeholder={t('auth_pages.username')}
                  prefix={
                    <Avatar src={userInfo?.avatar} />
                  }
                  value={userInfo?.full_name}
                  size="large"
                  readOnly={true}
                />
              </Form.Item>
              <Form.Item
                name="masterPassword"
                rules={[
                  RULES.REQUIRED(t('lock.master_password')),
                ]}
              >
                <Input.Password
                  placeholder={t('lock.master_password')}
                  size="large"
                  disabled={callingAPI || logging}
                  onPressEnter={handleCreateMasterPassword}
                />
              </Form.Item>
              <Form.Item
                name="confirmMasterPassword"
                rules={[
                  RULES.REQUIRED(t('create_master_password.confirm_master_password')),
                ]}
              >
                <Input.Password
                  placeholder={t('create_master_password.confirm_master_password')}
                  size="large"
                  disabled={callingAPI || logging}
                  onPressEnter={handleCreateMasterPassword}
                />
              </Form.Item>
              <Form.Item
                name="masterPasswordHint"
              >
                <Input.Password
                  placeholder={t('create_master_password.master_password_hint')}
                  size="large"
                  disabled={callingAPI || logging}
                  onPressEnter={handleCreateMasterPassword}
                />
              </Form.Item>
            </Form>
            <Button
              className="w-full"
              size="large"
              type="primary"
              htmlType="submit"
              disabled={logging}
              loading={callingAPI}
              onClick={handleCreateMasterPassword}
            >
              {t('create_master_password.title')}
            </Button>
            <p className="mb-6 mt-2">{t('create_master_password.note')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreateMasterPassword;