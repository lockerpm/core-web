import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
} from '@lockerpm/design';

import {
  ArrowLeftOutlined,
} from "@ant-design/icons";

import commonComponents from "../../../components/common";
import itemsComponents from "../../../components/items";

import commonServices from "../../../services/common";
import cipherServices from "../../../services/cipher";

import common from "../../../utils/common";
import global from "../../../config/global";

const VaultHistory = () => {
  const { PageHeader, CipherIcon } = commonComponents;
  const { RouterLink } = itemsComponents;
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === currentPage.params?.cipher_id) || {}
  }, [currentPage, allCiphers])

  const pageCipherType = useMemo(() => {
    return common.cipherTypeInfo('detailRouter', currentPage.name)
  }, [currentPage])

  const listRouterName = useMemo(() => {
    if (currentPage?.name === global.keys.FOLDER_DETAIL_ITEM_HISTORY) {
      return global.keys.FOLDER_DETAIL
    }
    if (currentPage?.name === global.keys.SHARED_WITH_ME_ITEM_HISTORY) {
      return global.keys.SHARED_WITH_ME
    }
    if (currentPage?.name === global.keys.SHARED_WITH_ME_FOLDER_ITEM_HISTORY) {
      return global.keys.SHARED_WITH_ME_FOLDER
    }
    if (currentPage?.name === global.keys.MY_SHARED_ITEMS_ITEM_HISTORY) {
      return global.keys.MY_SHARED_ITEMS
    }
    if (currentPage?.name === global.keys.MY_SHARED_ITEMS_FOLDER_ITEM_HISTORY) {
      return global.keys.MY_SHARED_ITEMS_FOLDER
    }
    if (currentPage?.name === global.keys.PASSWORD_HEALTH_WEAK_ITEM_HISTORY) {
      return global.keys.PASSWORD_HEALTH_WEAK_ITEM
    }
    if (currentPage?.name === global.keys.PASSWORD_HEALTH_REUSED_ITEM_HISTORY) {
      return global.keys.PASSWORD_HEALTH_REUSED_ITEM
    }
    if (currentPage?.name === global.keys.PASSWORD_HEALTH_EXPOSED_ITEM_HISTORY) {
      return global.keys.PASSWORD_HEALTH_EXPOSED_ITEM
    }
    return pageCipherType?.listRouter || global.keys.VAULT
  }, [pageCipherType])

  const listRouterParams = useMemo(() => {
    if ([
      global.keys.FOLDER_DETAIL_ITEM_HISTORY,
      global.keys.SHARED_WITH_ME_FOLDER_ITEM_HISTORY,
      global.keys.MY_SHARED_ITEMS_FOLDER_ITEM_HISTORY
    ].includes(currentPage?.name)) {
      return {
        folder_id: currentPage?.params.folder_id
      }
    }
    if ([
      global.keys.PASSWORD_HEALTH_WEAK_ITEM_HISTORY,
      global.keys.PASSWORD_HEALTH_REUSED_ITEM_HISTORY,
      global.keys.PASSWORD_HEALTH_EXPOSED_ITEM_HISTORY
    ].includes(currentPage?.name)) {
      return {
        cipher_id: currentPage?.params.cipher_id
      }
    }
    return {}
  }, [currentPage])

  const listRouterQuery = useMemo(() => {
    return {}
  }, [currentPage])
  

  useEffect(() => {
    if (originCipher && !originCipher.id) {
      global.navigate(global.keys.VAULT)
    }
  }, [originCipher])

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, {}, 0)}
    >
      <PageHeader
        title={originCipher?.name}
        subtitle={common.cipherSubtitle(originCipher)}
        actions={[]}
        Logo={() => <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={''}
            routerName={listRouterName}
            routerParams={listRouterParams}
            routerQuery={listRouterQuery}
            icon={<ArrowLeftOutlined />}
          />
          <CipherIcon
            className="mx-4"
            size={48}
            item={originCipher}
            type={originCipher.type}
            isDeleted={originCipher?.isDeleted}
          />
        </div>}
        Right={() => <></>}
      />
    </div>
  );
}

export default VaultHistory;