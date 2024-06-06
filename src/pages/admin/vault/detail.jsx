import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
} from '@lockerpm/design';
import {
  ArrowLeftOutlined
} from "@ant-design/icons";

import commonComponents from "../../../components/common";
import itemsComponents from "../../../components/items";
import cipherComponents from "../../../components/cipher";
import shareComponents from "../../../components/share";
import vaultComponents from "./components";

import commonServices from "../../../services/common";
import cipherServices from "../../../services/cipher";

import common from "../../../utils/common";
import global from "../../../config/global";

const VaultDetail = () => {
  const { PageHeader, CipherIcon } = commonComponents;
  const { RouterLink } = itemsComponents;
  const { DetailList, Actions } = cipherComponents;
  const { FormData, MoveFolder } = vaultComponents;
  const { QuickShareReview } = shareComponents;
  const ShareFormData = shareComponents.FormData;
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [menuType, setMenuType] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [sendId, setSendId] = useState(null);

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === currentPage.params?.cipher_id) || {}
  }, [currentPage, allCiphers])

  const pageCipherType = useMemo(() => {
    return common.cipherTypeInfo('detailRouter', currentPage.name)
  }, [currentPage])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('type', originCipher.type)
  }, [originCipher])

  const listRouterName = useMemo(() => {
    if (currentPage?.name === global.keys.FOLDER_DETAIL_ITEM) {
      return global.keys.FOLDER_DETAIL
    }
    return pageCipherType?.listRouter || global.keys.VAULT
  }, [pageCipherType])

  const listRouterParams = useMemo(() => {
    if (currentPage?.name === global.keys.FOLDER_DETAIL_ITEM) {
      return {
        folder_id: currentPage?.params.folder_id
      }
    }
    return {}
  }, [pageCipherType])

  const listRouterQuery = useMemo(() => {
    return {}
  }, [pageCipherType])
  

  useEffect(() => {
    if (originCipher && !originCipher.id) {
      global.navigate(global.keys.VAULT)
    }
  }, [originCipher])

  const handleOpenForm = (item = null, cloneMode = false) => {
    setFormVisible(true);
    setCloneMode(cloneMode)
  }

  const handleOpenMoveForm = (item = null) => {
    setMoveVisible(true);
  }

  const handleOpenShareForm = (item = null, isQuickShares = false) => {
    setMenuType(isQuickShares ? global.constants.MENU_TYPES.QUICK_SHARES : global.constants.MENU_TYPES.CIPHERS)
    setShareVisible(true);
  }

  const handleOpenReview = (sendId) => {
    setSendId(sendId);
    setReviewVisible(true);
  }
  
  const navigateListPage = () => {
    global.navigate(listRouterName, listRouterParams, listRouterQuery)
  }

  const deleteItems = (cipherIds) => {
    global.confirm(async () => {
      await cipherServices.multiple_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.deleted'));
        navigateListPage()
      }).catch((error) => {
        global.pushError(error)
      });
    }, {
      title: t('common.warning'),
      content: t('cipher.delete_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    });
  };

  const restoreItems = (cipherIds) => {
    global.confirm(async () => {
      await cipherServices.restore({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.restored'));
        navigateListPage()
      }).catch((error) => {
        global.pushError(error)
      });
    }, {
      title: t('common.warning'),
      content: t('cipher.restore_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    });
  };

  const stopSharingItem = async (cipher) => {
    try {
      await commonServices.stop_sharing_cipher(cipher);
      global.pushSuccess(t('notification.success.cipher.updated'));
    } catch (error) {
      global.pushError(error)
    }
  }

  const permanentlyDeleteItems = (cipherIds) => {
    global.confirm(async () => {
      await cipherServices.permanent_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.deleted'));
        navigateListPage()
      }).catch((error) => {
        global.pushError(error)
      });
    }, {
      title: t('common.warning'),
      content: t('cipher.permanently_delete_question'),
      okText: t('button.ok'),
    });
  };

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
        Right={() => <Actions
          size="medium"
          cipher={originCipher}
          onMove={handleOpenMoveForm}
          onUpdate={handleOpenForm}
          onDelete={deleteItems}
          onRestore={restoreItems}
          onShare={handleOpenShareForm}
          onStopSharing={stopSharingItem}
          onPermanentlyDelete={permanentlyDeleteItems}
        />}
      />
      <DetailList
        className="mt-4"
        cipher={originCipher}
      />
      <FormData
        visible={formVisible}
        item={originCipher}
        cipherType={cipherType}
        cloneMode={cloneMode}
        setCloneMode={setCloneMode}
        onClose={() => {
          setFormVisible(false);
        }}
      />
      <MoveFolder
        visible={moveVisible}
        cipherIds={[originCipher?.id]}
        onClose={() => {
          setMoveVisible(false);
        }}
      />
      <ShareFormData
        visible={shareVisible}
        item={originCipher}
        menuType={menuType}
        menuTypes={global.constants.MENU_TYPES}
        onClose={() => {
          setShareVisible(false);
        }}
        onReview={handleOpenReview}
      />
      <QuickShareReview
        visible={reviewVisible}
        sendId={sendId}
        onClose={() => {
          setReviewVisible(false);
          setSendId(null);
        }}
      />
    </div>
  );
}

export default VaultDetail;