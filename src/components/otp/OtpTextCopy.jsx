import React, { useState } from "react";

import itemsComponents from "../items";
import commonComponents from "../common";

import common from "../../utils/common";

const OtpTextCopy = (props) => {
  const { DisplayOtp } = commonComponents;
  const { TextCopy } = itemsComponents;

  const {
    totp,
    showText,
    codeSize,
    progressSize,
    className,
    codeClassName,
  } = props

  const [otp, setOtp] = useState(common.getTOTP(totp));

  return (
    <TextCopy
      value={otp}
      showIcon={true}
      align="between"
      show={showText}
      display={
        (sText = showText) => <DisplayOtp
          notes={totp}
          showText={sText}
          codeSize={codeSize}
          progressSize={progressSize}
          className={className}
          codeClassName={codeClassName}
          onReset={() => setOtp(common.getTOTP(totp))}
        />
      }
    />
  );
}

export default OtpTextCopy;