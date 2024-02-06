import React, {useEffect } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import cipherFormItemComponents from '../form-item';

const { PersonalForm, ContactForm } = cipherFormItemComponents;

function IdentityForm(props) {
  const {
    disabled = false
  } = props
  const { t } = useTranslation()

  useEffect(() => {
  }, [])

  return (
    <div className={props.className}>
      <PersonalForm className="mb-2" disabled={disabled}/>
      <ContactForm className="" disabled={disabled}/>
    </div>
  );
}

export default IdentityForm;
