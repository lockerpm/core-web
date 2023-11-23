import React, { useEffect, useState, useMemo } from "react";
import {
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const Enterprise = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="enterprise_dashboard layout-content">
      <AdminHeader
        title={t('enterprise_dashboard.title')}
        subtitle={t('enterprise_dashboard.description')}
        actions={[]}
      />
    </div>
  );
}

export default Enterprise; 