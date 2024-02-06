import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Popover,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

const { PasswordStrength } = itemsComponents;
const { GenerateOptions } = commonComponents;

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
            <GenerateOptions
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