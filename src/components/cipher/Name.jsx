import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Tag
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import commonComponents from "../common";

import common from "../../utils/common";
import global from "../../config/global";

const Name = (props) => {
  const { TextCopy, RouterLink, ImageIcon } = itemsComponents;
  const { CipherIcon } = commonComponents;

  const { t } = useTranslation()
  const location = useLocation();

  const {
    cipher = {},
    send = null
  } = props;
  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const locale = useSelector((state) => state.system.locale)

  const originCipher = useMemo(() => {
    if (send) {
      return send.cipher
    }
    return allCiphers.find((d) => d.id === cipher.id) || cipher
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
    if (currentPage?.name === global.keys.FOLDER_DETAIL) {
      return global.keys.FOLDER_DETAIL_ITEM
    }
    if (currentPage?.name === global.keys.SHARED_WITH_ME) {
      return global.keys.SHARED_WITH_ME_ITEM
    }
    if (currentPage?.name === global.keys.SHARED_WITH_ME_FOLDER) {
      return global.keys.SHARED_WITH_ME_FOLDER_ITEM
    }
    if (currentPage?.name === global.keys.MY_SHARED_ITEMS_FOLDER) {
      return global.keys.MY_SHARED_ITEMS_FOLDER_ITEM
    }
    if (currentPage?.name === global.keys.MY_SHARED_ITEMS) {
      if (currentPage?.query?.menu_type === global.constants.MENU_TYPES.QUICK_SHARES) {
        return global.keys.QUICK_SHARE_DETAIL
      }
      return global.keys.MY_SHARED_ITEMS_ITEM
    }
    if (currentPage?.name === global.keys.PASSWORD_HEALTH) {
      if (currentPage?.query?.active_key === 'reused_passwords') {
        return global.keys.PASSWORD_HEALTH_REUSED_ITEM
      }
      if (currentPage?.query?.active_key === 'exposed_passwords') {
        return global.keys.PASSWORD_HEALTH_EXPOSED_ITEM
      }
      return global.keys.PASSWORD_HEALTH_WEAK_ITEM
    }
    return cipherType?.detailRouter || global.keys.VAULT_DETAIL
  }, [currentPage, cipherType])

  const routerParams = useMemo(() => {
    if ([
      global.keys.FOLDER_DETAIL,
      global.keys.SHARED_WITH_ME_FOLDER,
      global.keys.MY_SHARED_ITEMS_FOLDER
    ].includes(currentPage?.name)) {
      return { 
        cipher_id: cipher.id || originCipher.id,
        folder_id: currentPage.params?.folder_id
      }
    }
    if (currentPage?.name === global.keys.MY_SHARED_ITEMS && currentPage?.query?.menu_type === global.constants.MENU_TYPES.QUICK_SHARES) {
      return {
        send_id: send.id
      }
    }
    return { 
      cipher_id: cipher.id || originCipher.id,
    }
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
      <div className="ml-2 flex-1" style={{ width: 'calc(100% - 36px)' }}>
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
              /> : <></>
            }
          />
          {
            send && common.isExpired(send) && <Tag
              className="ml-2"
              color="error"
            >
              {t('statuses.expired')}
            </Tag>
          }
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