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
import vaultHistoryComponents from "./components/history";

import cipherServices from "../../../services/cipher";

import common from "../../../utils/common";
import global from "../../../config/global";

const VaultHistory = () => {
  const { PageHeader, CipherIcon } = commonComponents;
  const { RouterLink } = itemsComponents;
  const { Filter, ListData, TableData, ConfirmRestoreModal } = vaultHistoryComponents;

  const location = useLocation();
  const { t } = useTranslation();

  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const isMobile = useSelector((state) => state.system.isMobile);
  const allCollections = useSelector((state) => state.collection.allCollections);

  const [restoreVisible, setRestoreVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [callingAPI, setCallingAPI] = useState(false);
  const [params, setParams] = useState({
    orderField: 'revisionDate',
    orderDirection: 'desc',
  });

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === currentPage.params?.cipher_id) || {}
  }, [currentPage, allCiphers])

  const isRestore = useMemo(() => {
    return common.isChangeCipher(originCipher);
  }, [originCipher])

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

  const filteredData = useMemo(() => {
    const pwHistory = originCipher.passwordHistory;
    return pwHistory
  }, [params, originCipher])

  const handleRestore = (item) => {
    setSelectedHistory(item);
    setRestoreVisible(true);
  }

  const onUpdateCipher = async () => {
    setCallingAPI(true);
    const formData = common.convertCipherToForm(originCipher);
    formData.password = selectedHistory?.password;
    const cipher = {
      ...common.convertFormToCipher(formData),
      organizationId: originCipher.organizationId
    }
    const passwordStrength = formData.password ? common.getPasswordStrength(formData.password) : {};
    const { data, collectionIds } = await common.getEncCipherForRequest(
      cipher,
      {
        writeableCollections: allCollections.filter((c) => common.isOwner(c)),
        nonWriteableCollections: allCollections.filter((c) => !common.isOwner(c)),
      }
    )
    const payload = {
      ...data,
      collectionIds,
      score: passwordStrength.score,
    }
    await cipherServices.update(originCipher.id, payload).then(() => {
      global.pushSuccess(t('notification.success.cipher.updated'));
      setRestoreVisible(false);
      global.navigate(listRouterName, listRouterParams, listRouterQuery);
    }).catch((error) => {
      global.pushError(error)
    })
    setCallingAPI(false);
  }

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
      <Filter
        className={'mt-2'}
        params={params}
        setParams={(v) => setParams(v)}
      />
      {
        isMobile ? <ListData
          className="mt-4"
          isRestore={isRestore}
          data={filteredData}
          onRestore={(v) => handleRestore(v)}
        /> : <TableData
          className="mt-4"
          isRestore={isRestore}
          data={filteredData}
          onRestore={(v) => handleRestore(v)}
        />
      }
      <ConfirmRestoreModal
        visible={restoreVisible}
        item={selectedHistory}
        callingAPI={callingAPI}
        onConfirm={() => onUpdateCipher()}
        onClose={() => setRestoreVisible(false)}
      />
    </div>
  );
}

export default VaultHistory;