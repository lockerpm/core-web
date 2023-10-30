import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import {
  PlusOutlined,
  RightOutlined
} from "@ant-design/icons";

const EmergencyAccess = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="flex text-primary cursor-pointer">
          <p className="font-semibold text-xl mr-2">
            {t('security.emergency_access.title')}
          </p>
          <RightOutlined />
        </div>
        <Button
          type='primary'
          ghost
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('security.emergency_access.add')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.emergency_access.description')}
      </p>
    </div>
  );
}

export default EmergencyAccess;
