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
    setCipher(item)
  }, [item])

  const cipherIcon = useMemo(() => {
    let logo = null
    if (cipher) {
      const selectedApp = global.constants.WALLET_APPS.find(a => a.alias === cipher?.cryptoWallet?.walletApp?.alias)
      if (cipher.type === CipherType.CryptoWallet && selectedApp) {
        logo = {
          src: selectedApp.icon,
          alt: selectedApp.name,
          shape: 'square'
        }
      } else if ([CipherType.Login, CipherType.MasterPassword].includes(cipher.type) && process.env.REACT_APP_LOGO_URL) {
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
        src={cipherIcon.src}
        alt={cipherIcon.alt}
        style={{ filter: isDeleted ? 'grayscale(100%)' : '' }}
        onError={() => setCipher(null)}
      />
    </div>
  );
}

export default CipherIcon;
