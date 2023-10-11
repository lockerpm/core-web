import React, { useMemo, useState } from "react";
import {
  Image
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { cipherTypeInfo } from "../../../../utils/common";
import { CipherType } from "../../../../core-js/src/enums";
import global from "../../../../config/global";

import extractDomain from 'extract-domain';

const CipherIcon = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    size = 32,
    item = null,
    type = null
  } = props;
  const [cipher, setCipher] = useState(item);

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
        const domain = extractDomain(cipher?.login.uris[0]._uri)
        if (domain) {
          logo = {
            src: `${process.env.REACT_APP_LOGO_URL}/${domain}?size=${size}`,
            alt: domain,
            shape: 'square'
          }
        }
      }
    }
    const cipherType = cipherTypeInfo('type', type)
    return logo || {
      src: cipherType.icon.default,
      alt: cipherType.key,
      shape: 'square'
    }
  }, [cipher, type])
  return (
    <div className={className}>
      <Image
        preview={false}
        width={size}
        height={size}
        src={cipherIcon.src}
        alt={cipherIcon.alt}
        onError={() => setCipher(null)}
      />
    </div>
  );
}

export default CipherIcon;
