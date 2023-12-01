import React, { useEffect, useState, useMemo } from "react";
import {
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const CompanyPolicy = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="company_policy layout-content">
      <AdminHeader
        title={t('company_policy.title')}
        subtitle={t('company_policy.description')}
        actions={[]}
      />
    </div>
  );
}

export default CompanyPolicy; 