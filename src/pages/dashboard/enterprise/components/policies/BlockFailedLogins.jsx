import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  Card,
  Switch,
  Divider,
  Button,
  Drawer,
  Space,
  Radio,
  Select
} from '@lockerpm/design';

import {
  EditOutlined
} from "@ant-design/icons";

import enterprisePolicyServices from "../../../../../services/enterprise-policy";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const BlockFailedLogins = (props) => {
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

  const attempts = [1, 3, 5, 7, 10, 20]
  const block_times = [1, 3 * 60, 5 * 60, 10 * 60, 15 * 60, 30 * 60, 1 * 3600, 2 * 3600, 4 * 3600]
  const logging_times = [1, 5 * 60, 10 * 60, 15 * 60, 30 * 60, 1 * 3600, 2 * 3600, 6 * 3600, 12 * 3600, 24 * 3600, 48 * 3600]

  useEffect(() => {
    setCallingAPI(false)
    if (policy && !common.isEmpty(policy)) {
      setConfig(policy?.config)
    }
  }, [JSON.stringify(policy), visible])

  const handleSave = async (enabled = policy.enabled) => {
    setCallingAPI(true);
    await enterprisePolicyServices.block_failed_login(enterpriseId, {
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
            {t('enterprise_policies.block_failed_logins.title')}
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
          {t('enterprise_policies.block_failed_logins.description')}
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
        title={t('enterprise_policies.block_failed_logins.title')}
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
        <p>{t('enterprise_policies.block_failed_logins.modal.description')}</p>
        <Divider className="my-4" />
        <p className="font-semibold text-xl mb-4">
          {t('common.configuration')}
        </p>
        <div>
          <p className="mb-2">{t('enterprise_policies.block_failed_logins.modal.block_when')}</p>
          <Select
            className="w-full mb-2"
            value={config.failed_login_attempts}
            options={attempts.map((o) => ({
              value: o,
              label: `${o} ${t('enterprise_policies.block_failed_logins.modal.failed_login_attempts')}`
            }))}
          />
          <Select
            className="w-full mb-2"
            value={config.failed_login_duration}
            options={block_times.map((o) => ({
              value: o,
              label: `${common.displayTimes(o).value} ${t(`common.${common.displayTimes(o).label}`)}`
            }))}
          />
          <p className="mb-2">{t('enterprise_policies.block_failed_logins.modal.how_long')}</p>
          <Select
            className="w-1/2"
            value={config.failed_login_block_time}
            options={logging_times.map((o) => ({
              value: o,
              label: `${common.displayTimes(o).value} ${t(`common.${common.displayTimes(o).label}`)}`
            }))}
          />
        </div>
        <Divider className="my-4" />
        <p className="font-semibold text-xl mb-4">
          {t('common.option')}
        </p>
        <div className="font-semibold">
          <Radio.Group
            name="radiogroup"
            value={config.failed_login_owner_email}
            onChange={(e) => setConfig({
              ...policy?.config,
              failed_login_owner_email: e.target.value
            })}
          >
            <Radio value={true} className='mb-1'>
              <p>{t('enterprise_policies.block_failed_logins.modal.receive_an_email')}</p>
            </Radio>
            <Radio value={false} className='mb-1'>
              <p>{t('enterprise_policies.block_failed_logins.modal.do_not_notify_me')}</p>
            </Radio>
          </Radio.Group>
        </div>
      </Drawer>
    </div>
  );
}

export default BlockFailedLogins;