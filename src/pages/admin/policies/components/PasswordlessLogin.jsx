import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

const PasswordlessLogin = (props) => {
  const { } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div
          className="flex text-primary cursor-pointer"
          onClick={() => setExpand(!expand)}
        >
          <p className="font-semibold text-xl mr-2">
            {t('policies.passwordless_login.title')}
          </p>
          {
            expand ? <DownOutlined /> : <RightOutlined />
          }
        </div>
      </div>
      <p className="mt-1">
        {t('policies.passwordless_login.description')}
      </p>
      {
        expand && <div className="mt-4">
          <p className="font-semibold text-[16px] mb-2">{t('policies.policy_details')}</p>
          <p className="mb-1">{t('policies.passwordless_login.note')}</p>
        </div>
      }
    </div>
  );
}

export default PasswordlessLogin;