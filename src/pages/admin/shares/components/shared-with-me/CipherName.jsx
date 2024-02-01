import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import components from '../../../../../components';

import {
} from "@ant-design/icons";

import Name from "../../../vault/components/Name";

const CipherName = (props) => {
  const {
    TextCopy,
    ImageIcon
  } = components;
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