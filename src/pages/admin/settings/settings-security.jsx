import React, { useEffect, useState, useMemo } from "react";
import { Divider } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { AdminHeader } from "../../../components";
import ChangePassword from "./components/security/ChangePassword";
import ChangeMasterPassword from "./components/security/ChangeMasterPassword";
import TwoFA from "./components/security/TwoFA";
import EmergencyAccess from "./components/security/EmergencyAccess";
import ManageSessions from "./components/security/ManageSessions";

import { useSelector } from 'react-redux';
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
      <ChangeMasterPassword />
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