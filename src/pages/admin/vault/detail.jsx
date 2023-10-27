import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";

import { AdminHeader } from "../../../components";
import FormData from "./components/FormData";
import MoveFolder from "./components/MoveFolder";
import CipherIcon from "./components/table/CipherIcon";
import Actions from "./components/table/Actions";
import ShareFormData from "../shares/components/FormData";
import QuickShareReview from "../shares/components/quick-shares/Review";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { CipherType } from "../../../core-js/src/enums"

import common from "../../../utils/common";
import global from "../../../config/global";
import commonServices from "../../../services/common";
import cipherServices from "../../../services/cipher";

const VaultDetail = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [callingAPI, setCallingAPI] = useState(false);
  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [menuType, setMenuType] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [sendId, setSendId] = useState(null);

  const originCipher = useMemo(() => {
    return allCiphers.find((c) => c.id === currentPage.params?.cipher_id)
  }, [currentPage, allCiphers])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('type', originCipher.type)
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

  const deleteItems = (cipherIds) => {
    global.confirmDelete(async () => {
      await cipherServices.multiple_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.deleted'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
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
    global.confirmDelete(async () => {
      await cipherServices.restore({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.restored'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
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
      global.pushSuccess(t('notification.success.cipher.updated'))
    } catch (error) {
      global.pushError(error)
    }
  }

  const permanentlyDeleteItems = (cipherIds) => {
    global.confirmDelete(async () => {
      await cipherServices.permanent_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.deleted'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
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
      <AdminHeader
        title={originCipher?.name}
        subtitle={common.cipherSubtitle(originCipher)}
        actions={[]}
        Logo={() => <CipherIcon
          className="mr-4"
          size={48}
          type={cipherType.type}
          // item={originCipher}
        />}
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