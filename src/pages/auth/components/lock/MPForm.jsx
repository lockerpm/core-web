import React, { } from "react";
import { useTranslation } from "react-i18next";

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
    isShowMPHint = false,
    onUnlock = () => {},
    setMPHintVisible = () => {}
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
          onPressEnter={onUnlock}
        />
      </Form.Item>
      {
        isShowMPHint && <p
          className="font-semibold text-primary mt-2 cursor-pointer"
          onClick={() => setMPHintVisible(true)}
        >
          {t('lock.master_password_hint')}
        </p>
      }
    </div>
  );
}

export default MPForm;