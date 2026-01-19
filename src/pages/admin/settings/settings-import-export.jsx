import React from "react";
import { useTranslation } from "react-i18next";

import { Divider } from '@lockerpm/design';

import commonComponents from "../../../components/common";
import importExportComponents from "./components/import-export";

const ImportExport = (props) => {
  const { PageHeader } = commonComponents;
  const { Import, Export } = importExportComponents;
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