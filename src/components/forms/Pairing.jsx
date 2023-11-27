import React, { useState, useEffect } from "react";
import {
  Input
} from '@lockerpm/design';

import { } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";

const PairingForm = (props) => {
  const { t } = useTranslation()
  const {
  } = props;

  return (
    <div className="pairing-form">
      <p>{t('')}</p>
    </div>
  );
}

export default PairingForm;