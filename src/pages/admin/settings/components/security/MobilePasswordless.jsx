import React, { useState } from "react";
import {
  Button,
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import QrCodeModal from "./mobile-passwordless/QrCode";

import {
  QrcodeOutlined,
} from "@ant-design/icons";

const MobilePasswordless = (props) => {
  const {
    className = '',
  } = props;
  const { t } = useTranslation();
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
          {t('security.mobile_passwordless.action')}
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
