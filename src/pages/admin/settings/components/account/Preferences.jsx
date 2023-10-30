import React, { } from "react";
import {
  Form,
  Select,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../../config/global";

const Preferences = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">
            {t('account_details.preferences.language')}
          </p>
        </div>
        <Form.Item
          name={'language'}
          className="mb-0"
        >
          <Select
            style={{ width: 150 }}
            options={global.constants.LANGUAGES}
          />
        </Form.Item>
      </div>
      <div className="flex justify-between mt-6">
        <div>
          <p className="font-semibold">
            {t('account_details.preferences.timeout')}
          </p>
          <p>
            {t('account_details.preferences.timeout_desc')}
          </p>
        </div>
        <Form.Item
          name={'timeout'}
          className="mb-0"
        >
          <Select
            style={{ width: 160 }}
            options={global.constants.VAULT_TIMEOUTS}
          />
        </Form.Item>
      </div>
      <div className="flex justify-between mt-6">
        <div>
          <p className="font-semibold">
            {t('account_details.preferences.timeout_action')}
          </p>
          <p>
            {t('account_details.preferences.timeout_action_lock_desc')}
          </p>
          <p>
            {t('account_details.preferences.timeout_action_logout_desc')}
          </p>
        </div>
        <Form.Item
          name={'timeout_action'}
          className="mb-0"
        >
          <Select
            style={{ width: 90 }}
            options={global.constants.VAULT_TIMEOUT_ACTIONS}
          />
        </Form.Item>
      </div>
    </div>
  );
}

export default Preferences;