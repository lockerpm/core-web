import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import TwoFAFormData from "./form-data/TwoFA";

import {
  MobileOutlined
} from "@ant-design/icons";

const TwoFA = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.two_fa.title')}
        </p>
        <Button
          type='primary'
          ghost
          icon={<MobileOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('security.two_fa.turn_on')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.two_fa.description')}
      </p>
      <TwoFAFormData
        visible={formVisible}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default TwoFA;
