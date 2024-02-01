import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import PasswordStrength from "./PasswordStrength";
import GeneratePasswordContent from "./GenerateOptions";

import { useTranslation } from "react-i18next";

import { } from 'react-redux';

const GeneratePassword = (props) => {
  const { t } = useTranslation();
  const {
    className = '',
    password = '',
    onFill = () => {}
  } = props;

  return (
    <div className={`generate-password ${className}`}>
      {
        password && <PasswordStrength password={password}/>
      }
      <div className="text-right">
        <Popover
          placement="bottomRight"
          trigger={['hover']}
          className="generate-password-popover"
          content={
            <GeneratePasswordContent
              className="p-2"
              width={250}
              onFill={onFill}
            />
          }
        >
          <span className="text-primary font-semibold cursor-pointer">
            {t('generate_password.title')}
          </span>
        </Popover>
      </div>
    </div>
  );
}

export default GeneratePassword;