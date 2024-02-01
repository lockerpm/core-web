import React, { useEffect, useState, useMemo } from "react";
import { Divider } from '@lockerpm/design';
import { } from "@ant-design/icons";

import components from "../../../components";
import Import from "./components/import-export/Import";
import Export from "./components/import-export/Export";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import { } from '../../../utils/common';


const ImportExport = (props) => {
  const { PageHeader } = components
  const { } = props;
  const { t } = useTranslation();
  return (
    <div className="import-export layout-content">
      <PageHeader
        title={t('import_export.title')}
        subtitle={t('import_export.description')}
        actions={[]}
      />
      <Import
        className="mt-4"
      />
      <Divider />
      <Export
        className=""
      />
      <Divider />
    </div>
  );
}

export default ImportExport;