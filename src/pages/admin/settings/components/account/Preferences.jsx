import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Form,
  Select,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import global from "../../../../../config/global";

const Preferences = (props) => {
  const { } = props
  const { t } = useTranslation();

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
              options={global.constants.LANGUAGES.map((o) => ({
                ...o,
                label: t(o.label)
              }))}
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
              options={global.constants.VAULT_TIMEOUTS.map((o) => ({
                ...o,
                label: t(o.label)
              }))}
            />
          </Form.Item>
        </div>
        <p className="mt-1">
          {t('account_details.preferences.timeout_desc')}
        </p>
        <p className="mt-1 text-warning">
          {t('account_details.preferences.timeout_note')}
        </p>
      </Card>
    </div>
  );
}

export default Preferences;