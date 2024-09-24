import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";
import { } from 'react-router-dom';

import {
  Form,
  Input,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import global from "../../../../config/global";

const MPForm = (props) => {
  const { t } = useTranslation();
  const {
    logging = false,
    callingAPI = false,
    handleUnlock = () => {},
  } = props;

  return (
    <div>
       <Form.Item
        name="password"
        noStyle
        rules={[
          global.rules.REQUIRED(t('lock.master_password')),
        ]}
      >
        <Input.Password
          placeholder={t('lock.master_password')}
          size="large"
          disabled={callingAPI || logging}
          onPressEnter={handleUnlock}
        />
      </Form.Item>
    </div>
  );
}

export default MPForm;