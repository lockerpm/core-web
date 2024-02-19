import React, { useState } from "react";
import { } from 'react-redux';
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
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('import_export.import')}
        </p>
        <Button
          type='primary'
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
