import React, {useEffect } from 'react';

import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import cipherFormItemComponents from '../form-item';

function IdentityForm(props) {
  const { PersonalForm, ContactForm } = cipherFormItemComponents;

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
