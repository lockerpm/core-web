import React, { useEffect } from "react";
import { Divider } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { AdminHeader } from "../../../components";
import ChangePassword from "./components/security/ChangePassword";
import Passwordless from "./components/security/Passwordless";
import MobilePasswordless from "./components/security/MobilePasswordless";
import CrossPlatformSync from "./components/security/CrossPlatformSync";
import TwoFA from "./components/security/TwoFA";
import EmergencyAccess from "./components/security/EmergencyAccess";
import ManageSessions from "./components/security/ManageSessions";

import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';

const Security = (props) => {
  const { } = props;
  const { t } = useTranslation();
  
  return (
    <div className="email-notifications layout-content">
      <AdminHeader
        title={t('security_control.title')}
        subtitle={t('security_control.description')}
        actions={[]}
      />
      <ChangePassword className="mt-4" />
      <Divider />
      <Passwordless />
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