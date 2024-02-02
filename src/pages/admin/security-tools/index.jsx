import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { Divider } from '@lockerpm/design';

import { } from "@ant-design/icons";

import commonComponents from "../../../components/common";
import securityToolsComponents from "./components";

const { PageHeader } = commonComponents;
const { PasswordGenerate, PasswordHealth, DataBreachScanner } = securityToolsComponents;

const SecurityTools = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="security-tools layout-content">
      <PageHeader
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