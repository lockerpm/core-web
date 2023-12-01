import React, { useEffect, useState, useMemo } from "react";
import {
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const CompanyGroups = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="company_groups layout-content">
      <AdminHeader
        title={t('company_groups.title')}
        subtitle={t('company_groups.description')}
        actions={[]}
      />
    </div>
  );
}

export default CompanyGroups; 