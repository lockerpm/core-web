import React from "react";
import {
  Image
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { cipherTypeInfo } from "../../../../utils/common";

import global from "../../../../config/global";

const CipherIcon = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    width = 32,
    height = 32,
    item = null,
    type = null
  } = props;
  const cipherType = cipherTypeInfo('type', type)
  return (
    <div className={className}>
      {
        item ? <Image
          preview={false}
          width={width}
          height={height}
          src={require(`../../../../assets/images/icons/ciphers/${cipherType.icon}.svg`).default}
        /> : <></>
      }
    </div>
  );
}

export default CipherIcon;
