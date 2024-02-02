import React, { useEffect, useMemo, useState } from "react";
import { } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Image
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { CipherType } from "../../core-js/src/enums";

import common from "../../utils/common";
import global from "../../config/global";

import extractDomain from 'extract-domain';

const CipherIcon = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    size = 32,
    item = null,
    type = null,
    typeKey = null,
    isDeleted = false
  } = props;

  const [cipher, setCipher] = useState(null);

  useEffect(() => {
    setCipher(null)
  }, [item])

  const cipherIcon = useMemo(() => {
    let logo = null
    if (cipher) {
      if (cipher.type === CipherType.CryptoWallet) {
        const selectedApp = global.constants.WALLET_APPS.find(a => a.alias === cipher?.cryptoWallet?.walletApp?.alias)
        logo = {
          src: selectedApp.logo,
          alt: selectedApp.name,
          shape: 'square'
        }
      } else if ([CipherType.Login, CipherType.MasterPassword].includes(cipher.type)) {
        const domain = cipher?.login?.uris && cipher?.login?.uris[0]?._uri ? extractDomain(cipher.login.uris[0]._uri) : null
        if (domain) {
          logo = {
            src: `${process.env.REACT_APP_LOGO_URL}/${domain}?size=${size}`,
            alt: domain,
            shape: 'square'
          }
        }
      }
    }
    const cipherType = typeKey ? common.cipherTypeInfo('key', typeKey) : common.cipherTypeInfo('type', type)
    return logo || {
      src: cipherType.icon.default,
      alt: cipherType.key,
      shape: 'square'
    }
  }, [cipher, type])
  return (
    <div className={className}>
      <Image
        key={type}
        preview={false}
        width={size}
        height={size}
        src={cipherIcon.src}
        alt={cipherIcon.alt}
        style={{ filter: isDeleted ? 'grayscale(100%)' : '' }}
      />
    </div>
  );
}

export default CipherIcon;
