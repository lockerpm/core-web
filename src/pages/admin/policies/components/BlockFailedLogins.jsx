import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DownOutlined,
  RightOutlined,
  WarningOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../../components/items";

import userServices from "../../../../services/user";

const BlockFailedLogins = (props) => {
  const { PolicyResult } = itemsComponents;
  const { policy } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState(0);

  useEffect(() => {
    if (policy?.enabled) {
      getViolations();
    }
  }, [policy])

  const getViolations = async () => {
    const res = await userServices.users_me_violation();
    setBlockedTimes(res.failed_login)
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('policies.block_failed_logins.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
        <PolicyResult
          issues={blockedTimes}
        />
      </div>
      <p className="mt-1">
        {t('policies.block_failed_logins.description')}
      </p>
      {
        expand && <div className="mt-4">
          <p className="font-semibold text-[16px] mb-2">{t('policies.policy_details')}</p>
          <p className="mb-1">{t('policies.block_failed_logins.note')}</p>
          {
            blockedTimes > 0 && <div className="mt-6">
              <div className="flex items-center font-semibold text-warning">
                <WarningOutlined />
                <p className="ml-2">{t('policies.block_failed_logins.you_have_been_blocked', { count: blockedTimes })}</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default BlockFailedLogins;