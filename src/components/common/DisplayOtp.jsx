import React, { useMemo, useState, useEffect } from "react";

import {
  Progress
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

import common from "../../utils/common";
import global from "../../config/global";

const DisplayOtp = (props) => {
  const {
    notes = null,
    justify = 'left',
    showText = true,
    progressSize = 28,
    codeSize = 76,
    className = "w-[160px]",
    codeClassName = "text-2xl font-semibold"
  } = props;

  const [otp, setOtp] = useState('')
  const [period, setPeriod] = useState(0)
  const [now, setNow] = useState(new Date().getTime() / 1000)

  const start = useMemo(() => {
    if (period > 0) {
      return period - Math.floor(now) % period
    }
    return period
  }, [period, now])

  const otpFormat = useMemo(() => {
    return common.formatOTP(otp)
  }, [otp])

  useEffect(() => {
    getOTP();
    setInterval(() => {
      setNow(new Date().getTime() / 1000)
    }, 1000);
  }, [])

  useEffect(() => {
    if (start === period) {
      getOTP();
    }
  }, [start, period])

  useEffect(() => { 
    setNow(new Date().getTime() / 1000);
    getOTP();
  }, [notes])

  const getOTP = async () => {
    const otp = await global.jsCore.totpService.getCode(notes)
    const period = await global.jsCore.totpService.getTimeInterval(notes)
    setOtp(otp)
    setPeriod(period)
  }

  return (
    <div
      className={`flex items-center justify-${justify} ${className}`}
    >
      <p
        className={`text-primary cursor-pointer ${codeClassName} w-[${codeSize}px]`}
        style={{ marginBottom: 0 }}
        onClick={() => common.copyToClipboard(otp)}
      >
        {common.formatText(otpFormat, showText)}
      </p>
      <span className={`ml-2 flex items-center w-[${progressSize}px]`}>
        <Progress
          size={progressSize}
          type="circle"
          percent={(start / period) * 100}
          showInfo={false}
          strokeColor={green[7]}
        />
      </span>
    </div>
  );
}

export default DisplayOtp;