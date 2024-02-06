import React, { } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import commonComponents from "../common";
import itemsComponents from "../items";

const { CipherIcon, DisplayOtp } = commonComponents;
const { TextCopy} = itemsComponents;

const Name = (props) => {
  const { t } = useTranslation()
  const { cipher = {} } = props;

  return (
    <div className="flex items-center">
      <CipherIcon
        type={cipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center justify-between">
          <TextCopy
            className={'font-semibold flex-1'}
            value={cipher.name}
          />
          <DisplayOtp
            notes={cipher.notes}
            justify="end"
          />
        </div>
      </div>
    </div>
  );
}

export default Name;