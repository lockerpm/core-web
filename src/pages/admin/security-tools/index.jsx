import React, { useEffect, useState, useMemo } from "react";
import { Divider } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { AdminHeader } from "../../../components";
import PasswordGenerate from "./components/PasswordGenerate";
import PasswordHealth from "./components/PasswordHealth";
import DataBreachScanner from "./components/DataBreachScanner";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const SecurityTools = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="security-tools layout-content">
      <AdminHeader
        title={t('security_tools.title')}
        subtitle={t('security_tools.description')}
        actions={[]}
      />
      <div className="mt-4">
        <PasswordGenerate />
        <Divider />
        <PasswordHealth />
        <Divider />
        <DataBreachScanner />
        <Divider />
      </div>
    </div>
  );
}

export default SecurityTools;