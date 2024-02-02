import React, { } from "react";
import { useTranslation } from "react-i18next";

import { Divider } from '@lockerpm/design';

import { } from "@ant-design/icons";

import commonComponents from "../../../components/common";

import TwoFA from "./components/security/TwoFA";
import UnlockMethods from "./components/security/UnlockMethods";
import MobilePasswordless from "./components/security/MobilePasswordless";
import CrossPlatformSync from "./components/security/CrossPlatformSync";
import EmergencyAccess from "./components/security/EmergencyAccess";
import ManageSessions from "./components/security/ManageSessions";

const { PageHeader } = commonComponents;

const Security = (props) => {
  const { } = props;
  const { t } = useTranslation();
  
  return (
    <div className="email-notifications layout-content">
      <PageHeader
        title={t('security_control.title')}
        subtitle={t('security_control.description')}
        actions={[]}
      />
      <UnlockMethods className="mt-4" />
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