import React, {useEffect } from 'react';
import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import PersonalForm from '../form-items/identity/PersonalInformation';
import ContactForm from '../form-items/identity/ContactInformation';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

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
