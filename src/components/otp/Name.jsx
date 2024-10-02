import React, { } from "react";
import { useSelector } from 'react-redux';
import { } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import commonComponents from "../common";

const Name = (props) => {
  const { CipherIcon, DisplayOtp } = commonComponents;
  const { cipher = {} } = props;

  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <div className="flex items-center flex-1">
      <CipherIcon
        type={cipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="block md:flex items-center justify-between">
          <p
            className={'font-semibold flex-1 text-limited'}
          >
            {cipher.name}
          </p>
          <DisplayOtp
            notes={cipher.notes}
            justify="left"
            className={isMobile ? "text-lg" : "text-xl font-semibold"}
            codeSize={isMobile ? 52 : 76}
            progressSize={isMobile ? 20 : 24}
          />
        </div>
      </div>
    </div>
  );
}

export default Name;