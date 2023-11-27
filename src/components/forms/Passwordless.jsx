import React, { useState, useEffect } from "react";
import {
  Input
} from '@lockerpm/design';

import { } from 'react-redux';
import { } from '@ant-design/colors';

import { useTranslation } from "react-i18next";

const PasswordlessForm = (props) => {
  const { t } = useTranslation()
  const {
    visible = false,
    title = '',
  } = props;

  useEffect(() => {
  }, [visible])

  const handleConfirm = async () => {
  }

  return (
    <div className="pairing-form">
      <p>{t('')}</p>
    </div>
  );
}

export default PasswordlessForm;