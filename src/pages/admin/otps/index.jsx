import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import { AdminHeader, Pagination, Multiple } from "../../../components";

import NoCipher from "../vault/components/NoCipher";
import Filter from "./components/Filter";
import TableData from "./components/TableData";
import BoxData from "./components/BoxData";
import FormData from "./components/FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { CipherType } from "../../../core-js/src/enums"

import common from "../../../utils/common";

import global from "../../../config/global";
import cipherServices from "../../../services/cipher";
import commonServices from "../../../services/common";

const Authenticator = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ciphers, setCiphers] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: currentPage?.query?.searchText || '',
  });

  const isEmpty = useMemo(() => {
    return !allCiphers.find((c) => !c.isDeleted && c.type === CipherType.TOTP)
  }, [allCiphers])

  const cipherType = useMemo(() => {
    return common.cipherTypeInfo('listRouter', currentPage.name)
  }, [JSON.stringify(currentPage)])

  useEffect(() => {
    fetchCiphers();
  }, [params.searchText, allCiphers])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(
      ciphers,
      params,
      params.orderField,
      params.orderDirection,
      [
        (f) => f.id,
        (f) => params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || '') : true
      ]
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
      deleted: false,
      searchText: params.searchText,
      filters: [(c) => c.type === CipherType.TOTP]
    }, allCiphers)
    setCiphers(result);
    setLoading(false);
  }

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
  }

  const deleteItem = (cipher) => {
    global.confirm(() => {
      cipherServices.permanent_delete({ ids: [cipher.id] }).then(async () => {
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
      className="authenticator layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t('sidebar.authenticator')}
        total={filteredData.total}
        actions={[
          {
            key: 'add',
            label: t('button.new_item'),
            type: 'primary',
            icon: <PlusOutlined />,
            hide: isEmpty,
            disabled: syncing || loading,
            click: () => handleOpenForm()
          }
        ]}
      />
      {
        !isEmpty && <Filter
          className={'mt-2'}
          params={params}
          loading={syncing}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        filteredData.total == 0 ? <NoCipher
          className={'mt-4'}
          cipherType={cipherType}
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
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default Authenticator;