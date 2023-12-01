import React, { useEffect, useState, useMemo } from "react";
import {
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const CompanyActivityLogs = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="company_activity_logs layout-content">
      <AdminHeader
        title={t('company_activity_logs.title')}
        subtitle={t('company_activity_logs.description')}
        actions={[]}
      />
    </div>
  );
}

export default CompanyActivityLogs; 