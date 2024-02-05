import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

import common from "../../utils/common";

const { TextCopy } = itemsComponents;
const { CipherIcon } = commonComponents;

const Name = (props) => {
  const { t } = useTranslation();
  const {
    cipher = {},
    allCiphers = [],
    onReview = () => {}
  } = props;

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher.id) || cipher
  }, [allCiphers, cipher])

  return (
    <div className="flex items-center">
      <CipherIcon
        item={originCipher}
        type={originCipher.type}
        isDeleted={originCipher?.isDeleted}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <div className="cursor-pointer" onClick={() => onReview(originCipher)}>
            <p className="text-primary font-semibold">
              {cipher.name || originCipher.name || t('shares.encrypted_content')}
            </p>
            {
              originCipher.organizationId ? <ImageIcon
                className="ml-1"
                name={'shares-icon'}
                title={t('inventory.shared')}
              /> : <></>
            }
          </div>
        </div>
        <TextCopy
          className="text-sm"
          value={common.cipherSubtitle(originCipher)}
        />
      </div>
    </div>
  );
}

export default Name;