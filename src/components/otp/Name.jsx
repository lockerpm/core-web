import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

import { CipherType } from "../../core-js/src/enums";
import common from "../../utils/common";

const Name = (props) => {
  const { CipherIcon, DisplayOtp } = commonComponents;
  const { TextCopy } = itemsComponents;

  const { cipher = {}, className = 'flex-1' } = props;

  const isMobile = useSelector((state) => state.system.isMobile);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const otpPassword = useMemo(() => {
    return allCiphers.find((c) => c.type === CipherType.Login && c.login.totp === cipher.notes)
  }, [allCiphers])

  return (
    <div className={`flex items-center ${className} flex-1`}>
      <CipherIcon
        className="w-[32px]"
        type={cipher.type}
      />
      <div className="ml-2" style={{ width: 'calc(100% - 40px)' }}>
        <div className="flex items-center justify-between">
          <div style={{ width: 'calc(100% - 124px)' }}>
            <p
              className={`font-semibold text-limited w-full flex-shrink-0 ${isMobile ? 'text-limited__block' : ''}`}
              title={cipher.name}
            >
              {cipher.name}
            </p>
            {
              !!otpPassword && <TextCopy
                className="text-sm"
                value={common.cipherSubtitle(otpPassword) || otpPassword.name}
              />
            }
          </div>
          <DisplayOtp
            notes={cipher.notes}
            justify="end"
            className="w-[116px]"
            codeClassName={isMobile ? "text-lg" : "text-xl font-semibold"}
            codeSize={isMobile ? 52 : 76}
            progressSize={isMobile ? 20 : 24}
          />
        </div>
      </div>
    </div>
  );
}

export default Name;