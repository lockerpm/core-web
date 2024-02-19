import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import cipherComponents from "../cipher";

const CipherName = (props) => {
  const { TextCopy, ImageIcon } = itemsComponents;
  const { Name } = cipherComponents;
  const { t } = useTranslation()
  const { cipher = {} } = props;
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher.id)
  }, [allCiphers, cipher])

  return (
    <div className="flex items-center">
      {
        originCipher ? <Name cipher={cipher}/> : <div className="flex items-center">
          <ImageIcon
            name={'any-icon'}
            width={32}
            height={32}
          />
          <TextCopy
            className="ml-2"
            value={t('shares.encrypted_content')}
          />
        </div>
      }
    </div>
  );
}

export default CipherName;