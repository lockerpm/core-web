import React, { } from "react";
import {
  Card,
  Form,
  Select,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../../config/global";

const Preferences = (props) => {
  const { callingAPI } = props
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isCloud = useSelector((state) => state.system.isCloud)

  return (
    <div>
      <Card bodyStyle={{ padding: 16 }} className="mb-4">
        <div className="flex justify-between">
          <p className="font-semibold">
            {t('account_details.preferences.language')}
          </p>
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
      </Card>
      <Card bodyStyle={{ padding: 16 }} className="mb-4">
        <div className="flex justify-between">
          <p className="font-semibold">
            {t('account_details.preferences.timeout')}
          </p>
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
        <p className="mt-1">
          {t('account_details.preferences.timeout_desc')}
        </p>
      </Card>
      {
        isCloud && <Card bodyStyle={{ padding: 16 }}>
          <div className="flex justify-between">
            <p className="font-semibold">
              {t('account_details.preferences.timeout_action')}
            </p>
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
          <p className="mt-1">
            {t('account_details.preferences.timeout_action_lock_desc')}
          </p>
          <p>
            {t('account_details.preferences.timeout_action_logout_desc')}
          </p>
        </Card>
      }
    </div>
  );
}

export default Preferences;