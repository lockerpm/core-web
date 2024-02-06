import React, { useEffect, useState } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
  Switch,
  Divider,
  Button,
  Drawer,
  Space,
  Radio
} from '@lockerpm/design';

import {
  EditOutlined
} from "@ant-design/icons";

import enterprisePolicyServices from "../../../../../services/enterprise-policy";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const LoginWith2FA = (props) => {
  const {
    loading = false,
    enterpriseId,
    policy = {},
    onUpdated = () => { }
  } = props;

  const { t } = useTranslation();
  const [visible, setVisible] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [config, setConfig] = useState({})

  useEffect(() => {
    setCallingAPI(false)
    if (policy && !common.isEmpty(policy)) {
      setConfig({ ...policy?.config, min_length: policy.config?.min_length || 0 })
    }
  }, [JSON.stringify(policy), visible])

  const handleSave = async (enabled = policy.enabled) => {
    setCallingAPI(true);
    await enterprisePolicyServices.two_fa(enterpriseId, {
      enabled,
      ...config,
    }).then(() => {
      global.pushSuccess(t('notification.success.policy.updated'))
      onUpdated({
        enabled,
        policy_type: policy.policy_type,
        config: config
      })
      setVisible(false);
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false)
  }

  return (
    <div>
      <Card
        loading={loading}
        title={false}
        hoverable={false}
        className="h-full"
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold mb-2 text-xl">
            {t('enterprise_policies.log_in_with_2fa.title')}
          </p>
          <Switch
            checked={policy.enabled}
            onChange={(v) => {
              if (v) {
                setVisible(true)
              } else {
                handleSave(false)
              }
            }}
          />
        </div>
        <p className="mb-2">
          {t('enterprise_policies.log_in_with_2fa.description')}
        </p>
        <Divider />
        <div className="text-center">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => setVisible(true)}
          >
            {t('button.edit')}
          </Button>
        </div>
      </Card>
      <Drawer
        title={t('enterprise_policies.log_in_with_2fa.title')}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              disabled={callingAPI}
              onClick={() => setVisible(false)}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="primary"
              loading={callingAPI}
              onClick={() => handleSave(true)}
            >
              {t('button.save')}
            </Button>
          </Space>
        }
      >
        <p>{t('enterprise_policies.log_in_with_2fa.modal.description')}</p>
        <p className="mt-1">{t('enterprise_policies.log_in_with_2fa.modal.description1')}</p>
        <Divider className="my-4" />
        <p className="font-semibold text-xl mb-4">
          {t('common.configuration')}
        </p>
        <div className="font-semibold">
          <Radio.Group
            name="radiogroup"
            value={config.only_admin}
            onChange={(e) => setConfig({ only_admin: e.target.value })}
          >
            <Radio value={true} className='mb-1'>
              <p>{t('enterprise_policies.log_in_with_2fa.modal.only_admin_and_primary_admin')}</p>
            </Radio>
            <Radio value={false} className='mb-1'>
              <p>{t('enterprise_policies.log_in_with_2fa.modal.apply_to_all_users')}</p>
            </Radio>
          </Radio.Group>
        </div>
      </Drawer>
    </div>
  );
}

export default LoginWith2FA;