import React, { useMemo, useState, useEffect } from "react";
import {
  Progress
} from '@lockerpm/design';

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '../../../../../components';

import {
} from "@ant-design/icons";
import { green } from '@ant-design/colors';

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const DisplayOtp = (props) => {
  const { t } = useTranslation()
  const {
    notes = null,
    justify = 'left',
    showText = true
  } = props;

  const [otp, setOtp] = useState('')
  const [period, setPeriod] = useState(30)
  const [now, setNow] = useState(new Date().getTime() / 1000)

  const start = useMemo(() => {
    return period - Math.floor(now) % period
  }, [period, now, period])

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
    setPeriod(30);
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
      className={`flex items-center justify-${justify}`}
      style={{ width: 160 }}
    >
      <p
        className="text-2xl font-semibold text-primary cursor-pointer"
        style={{ marginBottom: 0 }}
        onClick={() => common.copyToClipboard(otp)}
      >
        {common.formatText(otpFormat, showText)}
      </p>
      <span className="ml-2">
        <Progress
          size={28}
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