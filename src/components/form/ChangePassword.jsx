import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  Input,
  Button
} from '@lockerpm/design';
import { } from "@ant-design/icons";

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import authServices from "../../services/auth";
import userServices from "../../services/user";
import commonServices from "../../services/common";

import global from "../../config/global";
import { getRouterByLocation } from "../../utils/common"

const ChangePasswordForm = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    isAuth = false,
    cancelText = t('button.logout'),
    okText = t('button.update'),
    onCancel = () => {},
    callback = () => {}
  } = props
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [callingAPI, setCallingAPI] = useState(false);

  const handleChangePassword = async (values) => {
    const query = getRouterByLocation(window.location)?.query
    setCallingAPI(true);
    if (values.full_name) {
      await userServices.update({
        username: userServices.account_info().username,
        full_name: values.full_name
      })
    }
    await userServices.change_password({
      ...values,
      is_check_password: query?.is_check_password == 0 ? false : true
    }).then(async () => {
      const loginPayload = {
        username: userServices.account_info().username,
        password: values.new_password
      }
      await authServices.login(loginPayload).then(async (response) => {
        await commonServices.update_auth_info({ ...loginPayload, ...response });
        global.pushSuccess(t('notification.success.change_password.changed'));
        callback();

      }).catch((error) => {
        global.pushError(error)
      });
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleChangePassword}
      className={className}
    >
      {
        isAuth && <Form.Item
          name={'full_name'}
          label={t('common.full_name')}
          rules={[
            global.rules.REQUIRED(t("common.full_name")),
          ]}
        >
          <Input
            autoFocus
            disabled={callingAPI}
            placeholder={t('placeholder.enter')}
          />
        </Form.Item>
      }
      {
        !isAuth && <Form.Item
          name={'password'}
          label={t('change_password.current_password')}
          rules={[
            global.rules.REQUIRED(t("change_password.current_password")),
          ]}
        >
          <Input.Password
            disabled={callingAPI}
            placeholder={t('placeholder.enter')}
          />
        </Form.Item>
      }
      <Form.Item
        name={'new_password'}
        label={t('change_password.new_password')}
        rules={[
          global.rules.REQUIRED(t("change_password.new_password")),
          global.rules.LATEST_LENGTH(t('change_password.new_password'), 8)
        ]}
      >
        <Input.Password
          disabled={callingAPI}
          placeholder={t('placeholder.enter')}
        />
      </Form.Item>
      <Form.Item
        name={'confirm_new_password'}
        label={t('change_password.confirm_new_password')}
        rules={[
          global.rules.REQUIRED(t("change_password.confirm_new_password")),
          global.rules.LATEST_LENGTH(t('change_password.confirm_new_password'), 8)
        ]}
      >
        <Input.Password
          disabled={callingAPI}
          placeholder={t('placeholder.enter')}
        />
      </Form.Item>
      <div className="flex justify-end mt-6">
        <Button
          className="mr-2"
          disabled={callingAPI}
          onClick={() => onCancel()}
        >
          {cancelText}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={callingAPI}
        >
          {okText}
        </Button>
      </div>
    </Form>
  );
}

export default ChangePasswordForm;