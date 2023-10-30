import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components'

import {
  LogoutOutlined,
  RightOutlined
} from "@ant-design/icons";

const ManageSessions = (props) => {
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
            {t('security.manage_sessions.title')}
          </p>
          <RightOutlined />
        </div>
        <Button
          type='primary'
          ghost
          icon={<LogoutOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {t('security.manage_sessions.logout')}
        </Button>
      </div>
    </div>
  );
}

export default ManageSessions;
