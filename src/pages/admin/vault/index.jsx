import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import { AdminHeader, Pagination } from "../../../components";

import NoCipher from "./components/NoCipher";
import Filter from "./components/Filter";
import TableData from "./components/TableData";
import BoxData from "./components/BoxData";
import FormData from "./components/FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../utils/common";

import global from "../../../config/global";
import commonServices from "../../../services/common";
import cipherServices from "../../../services/cipher";
import { CipherType } from "../../../core-js/src/enums"

const Vault = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const [loading, setLoading] = useState(true);
  const [cloneMode, setCloneMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ciphers, setCiphers] = useState([]);
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
  }, [currentPage])

  const filters = useMemo(() => {
    const f = []
    if (cipherType.type) {
      f.push((c) => c.type === cipherType.type)
    } else {
      f.push((c) => c.type !== CipherType.TOTP)
    }
    return f
  }, [cipherType])

  const isEmpty = useMemo(() => {
    return !allCiphers.find(
      (c) => !c.isDeleted && (cipherType.type ? cipherType.type === c.type : true)
    )
  }, [allCiphers, JSON.stringify(cipherType)])

  useEffect(() => {
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

  const deleteItem = (cipher) => {
    global.confirmDelete(() => {
      cipherServices.multiple_delete({ ids: [cipher.id] }).then(async () => {
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
        !isEmpty && !syncing && !loading && <Filter
          className={'mt-2'}
          params={params}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
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
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            /> : <TableData
              className="mt-4"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
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
        setCloneMode={setCloneMode}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default Vault;