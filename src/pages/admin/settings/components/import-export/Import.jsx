import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import {
  ImportOutlined
} from "@ant-design/icons";

import ImportForm from "./ImportForm";

const Import = (props) => {
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
