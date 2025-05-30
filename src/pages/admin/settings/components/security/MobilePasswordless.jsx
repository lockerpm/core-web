import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
} from '@lockerpm/design';

import {
  QrcodeOutlined,
} from "@ant-design/icons";

import securityModalsComponents from "./modals";

const MobilePasswordless = (props) => {
  const { QrCodeModal } = securityModalsComponents;
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
  const isMobile = useSelector(state => state.system.isMobile);

  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <p className="font-semibold text-xl">
          {t('security.mobile_passwordless.title')}
        </p>
        <Button
          type='primary'
          ghost
          icon={<QrcodeOutlined />}
          onClick={() => setFormVisible(true)}
        >
          {isMobile ? '' : t('security.mobile_passwordless.action')}
        </Button>
      </div>
      <p className="mt-1">
        {t('security.mobile_passwordless.description')}
      </p>
      {
        formVisible && <QrCodeModal
          visible={formVisible}
          onClose={() => setFormVisible(false)}
        />
      }
    </div>
  );
}

export default MobilePasswordless;
