import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Divider } from '@lockerpm/design';

import {
  DownOutlined,
  RightOutlined
} from "@ant-design/icons";

import commonComponents from "../../../components/common";
import securityComponents from "./components/security";

const Security = (props) => {
  const { PageHeader } = commonComponents;
  const {
    ChangePassword,
    Passkey,
    SecurityKey,
    TwoFA,
    MobilePasswordless,
    CrossPlatformSync,
    EmergencyAccess,
    ManageSessions
  } = securityComponents;
  const { } = props;
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  
  return (
    <div className="email-notifications layout-content">
      <PageHeader
        title={t('security_control.title')}
        subtitle={t('security_control.description')}
        actions={[]}
      />
      <div className="mt-4">
        <div className="flex justify-between">
          <div
            className="flex text-primary cursor-pointer"
            onClick={() => setExpand(!expand)}
          >
            <p className="font-semibold text-xl mr-2">
              {t('security.unlock_methods.title')}
            </p>
            {
              expand ? <DownOutlined /> : <RightOutlined />
            }
          </div>
        </div>
        <p className="mt-1">
          {t('security.unlock_methods.description')}
        </p>
        {
          expand && <div className="mt-8">
            <ChangePassword />
            <Divider />
            <SecurityKey />
            <Divider />
            <Passkey />
          </div>
        }
      </div>
      <Divider />
      <MobilePasswordless />
      <Divider />
      <CrossPlatformSync />
      <Divider />
      <TwoFA />
      <Divider />
      <EmergencyAccess />
      <Divider />
      <ManageSessions />
      <Divider />
    </div>
  );
}

export default Security;