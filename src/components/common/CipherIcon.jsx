import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Image
} from '@lockerpm/design';

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
      } else if (cipher.type === CipherType.Card) {
        const brand = common.cardBrandByNumber(cipher?.card?.number)
        logo = {
          src: brand.icon,
          alt: brand.label,
          shape: 'square'
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
    <div className={`relative ${className}`}>
      <Image
        className="rounded-md"
        key={type}
        preview={false}
        width={size}
        src={cipherIcon.src}
        alt={cipherIcon.alt}
        style={{ filter: isDeleted ? 'grayscale(100%)' : '' }}
        onError={() => setCipher(null)}
      />
      {
        item?.login?.fido2Credentials?.length > 0 && <div className="absolute bottom-[-2px] right-[-2px] w-5 h-5 bg-black-100 rounded-full flex items-center justify-center">
          <img
            src={require("../../assets/images/icons/key.svg").default}
            className="w-3 h-3"
          />
        </div>
      }
    </div>
  );
}

export default CipherIcon;
