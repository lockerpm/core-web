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
  const { cipher = {}, className = 'flex-1' } = props;

  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <div className={`flex items-center ${className}`}>
      <CipherIcon
        type={cipher.type}
      />
      <div className="ml-2" style={{ width: 'calc(100% - 40px)' }}>
        <div className="block md:flex items-center justify-between">
          <p
            className={'font-semibold flex-1 text-limited text-limited__block'}
            title={cipher.name}
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