import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Select,
  Input,
} from '@lockerpm/design';
import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from '../../../../../../config/global';

function PasswordOTP(props) {
  const { form } = props
  const { t } = useTranslation()
  
  useEffect(() => {
  }, [visible])

  return (
    <div className={props.className}>
      <p></p>
    </div>
  );
}

export default PasswordOTP;
