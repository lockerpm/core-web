import React, { useEffect } from "react";
import { Divider } from '@lockerpm/design';
import { } from "@ant-design/icons";

import components from "../../../components";
import UnlockMethods from "./components/security/UnlockMethods";
import MobilePasswordless from "./components/security/MobilePasswordless";
import CrossPlatformSync from "./components/security/CrossPlatformSync";
import TwoFA from "./components/security/TwoFA";
import EmergencyAccess from "./components/security/EmergencyAccess";
import ManageSessions from "./components/security/ManageSessions";

import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';

const Security = (props) => {
  const { PageHeader } = components;
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