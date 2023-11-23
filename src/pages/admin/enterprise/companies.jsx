import React, { useEffect, useState, useMemo } from "react";
import {
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import { AdminHeader } from "../../../components";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const Companies = (props) => {
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="companies layout-content">
      <AdminHeader
        title={t('companies.title')}
        subtitle={t('companies.description')}
        actions={[]}
      />
    </div>
  );
}

export default Companies; 