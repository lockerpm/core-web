import React, { useMemo } from "react";
import {
  Image
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink,
  ImageIcon
} from '../../../../../components';

import {
} from "@ant-design/icons";

import CipherIcon from "./CipherIcon";

import common from "../../../../../utils/common";
import global from "../../../../../config/global";

const Name = (props) => {
  const { t } = useTranslation()
  const { cipher = {} } = props;
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === cipher.id)
  }, [allCiphers, cipher])

  const isCipherShare = useMemo(() => {
    return originCipher.organizationId && (
      common.isCipherShared(originCipher.organizationId)
        || common.isCipherSharedWithMe(originCipher.organizationId)
    )
  }, [originCipher])
  return (
    <div className="flex items-center">
      <CipherIcon
        item={originCipher}
        type={originCipher.type}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={cipher.name || t('shares.encrypted_content')}
            routerName={global.keys.VAULT_DETAIL}
            routerParams={{ cipher_id: cipher.id }}
            icon={
              isCipherShare ? <ImageIcon
                className="ml-1"
                name={'shares-icon'}
                title={t('inventory.shared')}
              /> : <></>
            }
          />
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