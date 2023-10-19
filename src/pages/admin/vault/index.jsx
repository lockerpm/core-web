import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import { AdminHeader, Pagination, Multiple } from "../../../components";

import NoCipher from "./components/NoCipher";
import Filter from "./components/Filter";
import TableData from "./components/TableData";
import BoxData from "./components/BoxData";
import FormData from "./components/FormData";
import MoveFolder from "./components/MoveFolder";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { CipherType } from "../../../core-js/src/enums"

import common from "../../../utils/common";

import global from "../../../config/global";
import commonServices from "../../../services/common";
import cipherServices from "../../../services/cipher";

const Vault = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)

  const [loading, setLoading] = useState(true);
  const [callingAPI, setCallingAPI] = useState(false);
  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ciphers, setCiphers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: '',
  });

  const cipherType = useMemo(() => {
    if (currentPage.name === global.keys.TRASH) {
      return {
        type: null,
        title: t('sidebar.trash'),
        deleted: true,
        listRouter: global.keys.TRASH,
        detailRouter: global.keys.TRASH_DETAIL,
      }
    }
    return {
      ...common.cipherTypeInfo('listRouter', currentPage.name),
      deleted: false,
    }
  }, [JSON.stringify(currentPage)])

  const filters = useMemo(() => {
    const f = []
    if (cipherType.type) {
      f.push((c) => c.type === cipherType.type)
    } else {
      f.push((c) => c.type !== CipherType.TOTP)
      if (currentPage.name === global.keys.FOLDER_DETAIL) {
        f.push((c) => c.folderId == currentPage.params.folder_id)
      }
    }
    return f
  }, [cipherType, currentPage])

  const isEmpty = useMemo(() => {
    return !allCiphers.find(
      (c) => !c.isDeleted && (cipherType.type ? cipherType.type === c.type : true)
    )
  }, [allCiphers, JSON.stringify(cipherType)])

  useEffect(() => {
    setSelectedRowKeys([]);
    fetchCiphers();
  }, [params.searchText, allCiphers, JSON.stringify(cipherType)])

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
      deleted: cipherType.deleted,
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

  const handleMoveForm = (item = null) => {
    setSelectedItem(item);
    setMoveVisible(true);
  }

  const getCheckboxProps = (record) => {
    const originCipher = allCiphers.find((cipher) => cipher.id === record.id)
    return {
      disabled: originCipher.type === CipherType.MasterPassword || !common.isOwner(allOrganizations, originCipher)
    }
  }

  const handleSelectionChange = (keys, key, value) => {
    if (keys) {
      const selectedCiphers = ciphers.filter((cipher) => keys.includes(cipher.id)
        && cipher.type !== CipherType.MasterPassword
        && common.isOwner(allOrganizations, cipher)
      )
      setSelectedRowKeys(selectedCiphers.map((cipher) => cipher.id))
    } else {
      const selectedKeys = value ? [...selectedRowKeys, key] : selectedRowKeys.filter((k) => k !== key);
      setSelectedRowKeys(selectedKeys)
    }
  }

  const deleteItems = (cipherIds) => {
    global.confirmDelete(async () => {
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
    global.confirmDelete(async () => {
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
      await commonServices.stop_sharing(cipher);
      global.pushSuccess(t('notification.success.cipher.updated'))
    } catch (error) {
      global.pushError(error)
    }
  }

  const permanentlyDeleteItems = (cipherIds) => {
    global.confirmDelete(async () => {
      setCallingAPI(true)
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
      <AdminHeader
        title={cipherType.title}
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
            selectedRowKeys.length > 0 ? <Multiple
              selectedRowKeys={selectedRowKeys}
              callingAPI={callingAPI}
              isMove={currentPage.name !== global.keys.TRASH}
              isDelete={currentPage.name !== global.keys.TRASH}
              isRestore={currentPage.name === global.keys.TRASH}
              isPermanentlyDelete={currentPage.name === global.keys.TRASH}
              onMove={() => handleMoveForm(null)}
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
          type={cipherType.type}
          loading={syncing || loading}
          isEmpty={isEmpty}
          onCreate={() => handleOpenForm()}
        /> : <>
          {
            isMobile ? <BoxData
              className="mt-4"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              selectedRowKeys={selectedRowKeys}
              onMove={handleMoveForm}
              onUpdate={handleOpenForm}
              onDelete={deleteItems}
              onRestore={restoreItems}
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
              onMove={handleMoveForm}
              onUpdate={handleOpenForm}
              onDelete={deleteItems}
              onRestore={restoreItems}
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
    </div>
  );
}

export default Vault;