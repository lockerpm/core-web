import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink,
} from '../../../../../../../components';

import {
} from "@ant-design/icons";

import CipherIcon from "../../../../../vault/components/table/CipherIcon";

import common from "../../../../../../../utils/common";

const Name = (props) => {
  const { t } = useTranslation()
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
        // item={originCipher}
        type={originCipher.type}
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