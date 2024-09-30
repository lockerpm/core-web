import React, { } from "react";
import { } from 'react-redux';
import { } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import commonComponents from "../common";
import itemsComponents from "../items";

const Name = (props) => {
  const { CipherIcon, DisplayOtp } = commonComponents;
  const { TextCopy} = itemsComponents;
  const { cipher = {} } = props;

  return (
    <div className="flex items-center flex-1">
      <CipherIcon
        type={cipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="block md:flex items-center justify-between">
          <TextCopy
            className={'font-semibold flex-1'}
            value={cipher.name}
          />
          <DisplayOtp
            notes={cipher.notes}
            justify="left"
          />
        </div>
      </div>
    </div>
  );
}

export default Name;