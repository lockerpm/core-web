import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import components from "../../../components";

import NoCipher from "../../../components/vault/NoCipher";
import Filter from "./components/Filter";
import TableData from "./components/TableData";
import ListData from "./components/ListData";
import FormData from "./components/FormData";
import MoveFolder from "./components/MoveFolder";

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

const Vault = (props) => {
  const { PageHeader, Pagination, MultipleSelect } = components;
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);

  const [loading, setLoading] = useState(true);
  const [callingAPI, setCallingAPI] = useState(false);
  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [sendId, setSendId] = useState(null);
  const [ciphers, setCiphers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: currentPage?.query?.searchText,
  });

  const cipherType = useMemo(() => {
    const type = common.cipherTypeInfo('listRouter', currentPage.name)
    return {
      ...type,
      isDeleted: type.isDeleted || false,
    }
  }, [JSON.stringify(currentPage)])

  const filters = useMemo(() => {
    const f = []
    if (cipherType.type) {
      f.push((c) => c.type === cipherType.type)
    } else {
      f.push((c) => c.type !== CipherType.TOTP)
      if (currentPage.name === global.keys.FOLDER_DETAIL) {
        const folderId = currentPage.params.folder_id
        f.push((c) => (c.folderId === folderId) || (c.collectionIds && c.collectionIds[0] === folderId))
      }
    }
    return f
  }, [cipherType, currentPage])

  const isEmpty = useMemo(() => {
    return !allCiphers.find(
      (c) => c.isDeleted === cipherType.isDeleted && (cipherType.type ? cipherType.type === c.type : true)
    )
  }, [allCiphers, JSON.stringify(cipherType)])

  useEffect(() => {
    setSelectedRowKeys([]);
    fetchCiphers();
  }, [currentPage.name, params.searchText, allCiphers, JSON.stringify(cipherType)])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, cipherType.type, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(
      ciphers,
      params,
      params.orderField,
      params.orderDirection
    )
  }, [ciphers, JSON.stringify(params)])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      size: global.constants.PAGE_SIZE
    })
  }, [isMobile])

  const handleChangePage = (page, size) => {
    setSelectedRowKeys([])
    setParams({
      ...params,
      page,
      size
    })
  };

  const fetchCiphers = async () => {
    setLoading(true);
    const result = await commonServices.list_ciphers({
      deleted: cipherType.isDeleted,
      searchText: params.searchText,
      filters: filters
    }, allCiphers)
    setCiphers(result);
    setLoading(false);
  }

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
    setCloneMode(cloneMode)
  }

  const handleOpenMoveForm = (item = null) => {
    setSelectedItem(item);
    setMoveVisible(true);
  }

  const handleOpenShareForm = (item = null, isQuickShares = false) => {
    setSelectedItem(item);
    setMenuType(isQuickShares ? global.constants.MENU_TYPES.QUICK_SHARES : global.constants.MENU_TYPES.CIPHERS)
    setShareVisible(true);
  }

  const handleOpenReview = (sendId) => {
    setSendId(sendId);
    setReviewVisible(true);
  }

  const getCheckboxProps = (record) => {
    const originCipher = allCiphers.find((cipher) => cipher.id === record.id)
    return {
      disabled: originCipher && (originCipher.type === CipherType.MasterPassword || !common.isOwner(originCipher))
    }
  }

  const handleSelectionChange = (keys, key, value) => {
    if (keys) {
      const selectedCiphers = ciphers.filter((cipher) => keys.includes(cipher.id)
        && cipher.type !== CipherType.MasterPassword
        && common.isOwner(cipher)
      )
      setSelectedRowKeys(selectedCiphers.map((cipher) => cipher.id))
    } else {
      const selectedKeys = value ? [...selectedRowKeys, key] : selectedRowKeys.filter((k) => k !== key);
      setSelectedRowKeys(selectedKeys)
    }
  }

  const deleteItems = (cipherIds) => {
    global.confirm(async () => {
      setCallingAPI(true)
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
      setCallingAPI(false)
    }, {
      title: t('common.warning'),
      content: t('cipher.delete_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    });
  };

  const restoreItems = (cipherIds) => {
    global.confirm(async () => {
      setCallingAPI(true)
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
      setCallingAPI(false)
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
    global.confirm(async () => {
      setCallingAPI(true)
      await cipherServices.permanent_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.deleted'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
        setSelectedRowKeys([]);
      }).catch((error) => {
        global.pushError(error)
      });
      setCallingAPI(false)
    }, {
      title: t('common.warning'),
      content: t('cipher.permanently_delete_question'),
      okText: t('button.ok'),
    });
  };

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <PageHeader
        title={t(cipherType.title)}
        total={filteredData.total}
        actions={[
          {
            key: 'add',
            label: t('button.new_item'),
            type: 'primary',
            icon: <PlusOutlined />,
            hide: currentPage.name === global.keys.TRASH || isEmpty,
            disabled: syncing || loading,
            click: () => handleOpenForm()
          }
        ]}
      />
      {
        !isEmpty && <>
          {
            selectedRowKeys.length > 0 ? <MultipleSelect
              selectedRowKeys={selectedRowKeys}
              callingAPI={callingAPI}
              isMove={currentPage.name !== global.keys.TRASH}
              isDelete={currentPage.name !== global.keys.TRASH}
              isRestore={currentPage.name === global.keys.TRASH}
              isPermanentlyDelete={currentPage.name === global.keys.TRASH}
              onMove={() => handleOpenMoveForm(null)}
              onDelete={deleteItems}
              onRestore={restoreItems}
              onPermanentlyDelete={permanentlyDeleteItems}
              onCancel={() => setSelectedRowKeys([])}
            /> : <Filter
              className={'mt-2'}
              params={params}
              loading={syncing}
              setParams={(v) => setParams({ ...v, page: 1 })}
            />
          }
        </>
      }
      {
        filteredData.total == 0 ? <NoCipher
          className={'mt-4'}
          cipherType={cipherType}
          loading={syncing || loading}
          isEmpty={isEmpty}
          isTrash={currentPage.name === global.keys.TRASH}
          onCreate={() => handleOpenForm()}
        /> : <>
          {
            isMobile ? <ListData
              className="mt-4"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              selectedRowKeys={selectedRowKeys}
              onMove={handleOpenMoveForm}
              onUpdate={handleOpenForm}
              onDelete={deleteItems}
              onRestore={restoreItems}
              onShare={handleOpenShareForm}
              onStopSharing={stopSharingItem}
              onPermanentlyDelete={permanentlyDeleteItems}
              selectionChange={handleSelectionChange}
              getCheckboxProps={getCheckboxProps}
            /> : <TableData
              className="mt-4"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              selectedRowKeys={selectedRowKeys}
              onMove={handleOpenMoveForm}
              onUpdate={handleOpenForm}
              onDelete={deleteItems}
              onRestore={restoreItems}
              onShare={handleOpenShareForm}
              onStopSharing={stopSharingItem}
              onPermanentlyDelete={permanentlyDeleteItems}
              selectionChange={handleSelectionChange}
              getCheckboxProps={getCheckboxProps}
            />
          }
        </>
      }
      {
        filteredData.total > global.constants.PAGE_SIZE && !isMobile && <Pagination
          params={params}
          total={filteredData.total}
          onChange={handleChangePage}
        />
      }
      <FormData
        visible={formVisible}
        item={selectedItem}
        cipherType={cipherType}
        cloneMode={cloneMode}
        folderId={currentPage.params.folder_id}
        setCloneMode={setCloneMode}
        onClose={() => {
          setFormVisible(false);
          setSelectedItem(null);
        }}
      />
      <MoveFolder
        visible={moveVisible}
        cipherIds={selectedItem ? [selectedItem.id] : selectedRowKeys}
        onClose={() => {
          setMoveVisible(false);
          setSelectedItem(null);
        }}
      />
      <ShareFormData
        visible={shareVisible}
        item={selectedItem}
        menuType={menuType}
        menuTypes={global.constants.MENU_TYPES}
        onClose={() => {
          setShareVisible(false);
          setSelectedItem(null);
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

export default Vault;