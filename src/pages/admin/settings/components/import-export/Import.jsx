import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  ImportOutlined
} from "@ant-design/icons";

import formsComponents from "../../../../../components/forms"; 

const Import = (props) => {
  const { ImportForm } = formsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();

  const currentPage = useSelector(state => state.system.currentPage)
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (currentPage?.query?.is_import == 1) {
      setFormVisible(true);
    }
  }, [
    currentPage.query?.is_import
  ])

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('import_export.import')}
        </p>
        <Button
          type='primary'
          className="import-items"
          ghost
          icon={<ImportOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('button.import')}
        </Button>
      </div>
      <p className="mt-1">
        {t('import_export.import_description')}
      </p>
      <ImportForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default Import;
