import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

const LoginWith2FA = (props) => {
  const { policy } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  const login2FATarget = useMemo(() => {
    if (policy?.config?.onlyAdmin) {
      return 'roles.admin'
    }
    return 'common.users'
  }, [policy])
  
  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('policies.log_in_with_2fa.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
      </div>
      <p className="mt-1">
        {t('policies.log_in_with_2fa.description')}
      </p>
      {
        expand && <div className="mt-4">
          <p className="font-semibold text-[16px] mb-2">{t('policies.policy_details')}</p>
          <p className="mb-1">{t('policies.log_in_with_2fa.note', { target: t(login2FATarget) })}</p>
        </div>
      }
    </div>
  );
}

export default LoginWith2FA;