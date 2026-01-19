import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Tag,
} from '@lockerpm/design';

import itemsComponents from "../items";
import commonComponents from "../common";

import common from "../../utils/common";

const Name = (props) => {
  const { TextCopy, RouterLink, ImageIcon } = itemsComponents;
  const { CipherIcon } = commonComponents;

  const { t } = useTranslation()
  const location = useLocation();

  const {
    cipher = {},
    send = null,
    onClick = undefined
  } = props;
  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const locale = useSelector((state) => state.system.locale)

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => send ? send.cipherId === d.id : d.id === cipher.id) || cipher
  }, [allCiphers, cipher])

  const isCipherShare = useMemo(() => {
    if (send) {
      return false
    }
    return originCipher.organizationId && (
      common.isCipherShared(originCipher.organizationId)
        || common.isCipherSharedWithMe(originCipher.organizationId)
    )
  }, [originCipher])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('listRouter', currentPage.name, cipher.type)
  }, [originCipher, currentPage])

  const cipherLabel = useMemo(() => {
    return cipher.name || originCipher.name || t('shares.encrypted_content')
  }, [cipher, originCipher, locale])

  const routerName = useMemo(() => {
    return common.getCipherRouterName(currentPage, cipherType);
  }, [currentPage, cipherType])

  const routerParams = useMemo(() => {
    return common.getCipherRouterParams(currentPage, cipher.id || originCipher.id, send?.id)
  }, [
    cipher,
    originCipher,
    currentPage,
    send
  ])

  return (
    <div className="flex items-center w-full">
      <CipherIcon
        item={originCipher}
        isDeleted={originCipher?.isDeleted}
        type={originCipher.type}
      />
      <div className="ml-2 flex-1" style={{ width: 'calc(100% - 40px)' }}>
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={cipherLabel}
            routerName={routerName}
            routerParams={routerParams}
            icon={
              isCipherShare ? <ImageIcon
                className="ml-1"
                name={'shares-icon'}
                title={t('inventory.shared')}
              /> : send && common.isExpired(send) ? <Tag
                className="ml-2"
                color="error"
              >
                {t('statuses.expired')}
              </Tag> : null
            }
            onClick={onClick}
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