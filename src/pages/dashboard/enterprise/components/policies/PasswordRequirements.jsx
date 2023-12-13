import React, { useEffect, useState } from "react";
import {
  Card,
  Switch,
  Divider,
  Button,
  Drawer,
  Space,
  Slider,
  Checkbox
} from '@lockerpm/design';

import {
  EditOutlined
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

import enterprisePolicyServices from "../../../../../services/enterprise-policy";

const PasswordRequirements = (props) => {
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
    if (!policy.enabled) {
      setVisible(true);
      return;
    }
    setCallingAPI(true);
    await enterprisePolicyServices.password_requirement(enterpriseId, {
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
            {t('enterprise_policies.password_requirements.title')}
          </p>
          <Switch
            checked={policy.enabled}
            onChange={(v) => handleSave(v)}
          />
        </div>
        <p className="mb-2">
          {t('enterprise_policies.password_requirements.description')}
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
        title={t('enterprise_policies.password_requirements.title')}
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
        <p>{t('enterprise_policies.password_requirements.modal.description')}</p>
        <Divider className="my-4" />
        <p className="font-semibold text-xl mb-4">
          {t('common.configuration')}
        </p>
        <div className="font-semibold">
          <p className="font-semibold">
            {t('enterprise_policies.password_requirements.modal.minimum_password_length')}: <span className="text-primary">{config.min_length} {t('common.characters')}</span>
          </p>
          <Slider
            className="mx-0 my-3"
            value={config.min_length}
            onChange={(v) => setConfig({ ...config, min_length: v })}
          />
          <p className="font-semibold mb-4">
            {t('enterprise_policies.password_requirements.modal.password_complexity')}
          </p>
          <Checkbox
            className="w-full mb-1"
            checked={config.require_lower_case}
            onChange={(e) => setConfig({ ...config, require_lower_case: e.target.checked })}
          >
            {t('enterprise_policies.password_requirements.modal.requires_lowercase')}
          </Checkbox>
          <Checkbox
            className="w-full mb-1"
            checked={config.require_upper_case}
            onChange={(e) => setConfig({ ...config, require_upper_case: e.target.checked })}
          >
            {t('enterprise_policies.password_requirements.modal.requires_uppercase')}
          </Checkbox>
          <Checkbox
            className="w-full mb-1"
            checked={config.require_digit}
            onChange={(e) => setConfig({ ...config, require_digit: e.target.checked })}
          >
            {t('enterprise_policies.password_requirements.modal.requires_digit')}
          </Checkbox>
          <Checkbox
            className="w-full"
            checked={config.require_special_character}
            onChange={(e) => setConfig({ ...config, require_special_character: e.target.checked })}
          >
            {t('enterprise_policies.password_requirements.modal.requires_special_character')}
          </Checkbox>
        </div>
      </Drawer>
    </div>
  );
}

export default PasswordRequirements;