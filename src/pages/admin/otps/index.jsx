import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { } from '@lockerpm/design';

import { PlusOutlined } from "@ant-design/icons";

import itemsComponents from "../../../components/items";
import commonComponents from "../../../components/common";
import cipherComponents from "../../../components/cipher";
import otpsComponents from "./components";

import { CipherType } from "../../../core-js/src/enums"

import cipherServices from "../../../services/cipher";

import global from "../../../config/global";
import common from "../../../utils/common";

const Authenticator = () => {
  const { Pagination, MultipleSelect } = itemsComponents;
  const { PageHeader } = commonComponents;
  const { NoCipher } = cipherComponents;
  const { Filter, TableData, ListData, FormData } = otpsComponents;

  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)

  const [loading, setLoading] = useState(true);
  const [callingAPI, setCallingAPI] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ciphers, setCiphers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
    if (currentPage?.query?.is_create == 1) {
      handleOpenForm(null);
      global.navigate(currentPage.name, {}, {})
    }
  }, [
    currentPage.query?.is_create
  ])

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
    const result = await common.listCiphers({
      deleted: false,
      searchText: params.searchText,
      filters: [(c) => c.type === CipherType.TOTP]
    }, allCiphers)
    setCiphers(result);
    setLoading(false);
  }

  const handleOpenForm = (item = null) => {
    setSelectedItem(item);
    setFormVisible(true);
  }

  const deleteItem = (cipher) => {
    global.confirm(() => {
      cipherServices.permanent_delete({ ids: [cipher.id] }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.permanently_deleted'));
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

  const permanentlyDeleteItems = (cipherIds) => {
    global.confirm(async () => {
      setCallingAPI(true)
      await cipherServices.permanent_delete({ ids: cipherIds }).then(async () => {
        global.pushSuccess(t('notification.success.cipher.permanently_deleted'));
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

  const getCheckboxProps = (record) => {
    const originCipher = allCiphers.find((cipher) => cipher.id === record.id)
    return {
      disabled: originCipher && (originCipher.type === CipherType.MasterPassword || !common.isOwner(originCipher))
    }
  }

  return (
    <div
      className="authenticator layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <PageHeader
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
        !isEmpty && <>
          {
            selectedRowKeys.length > 0 ? <MultipleSelect
              selectedRowKeys={selectedRowKeys}
              callingAPI={callingAPI}
              isPermanentlyDelete={true}
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
          onCreate={() => handleOpenForm()}
        /> : <>
          {
            isMobile ? <ListData
              className="mt-2"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              selectedRowKeys={selectedRowKeys}
              selectionChange={handleSelectionChange}
              getCheckboxProps={getCheckboxProps}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            /> : <TableData
              className="mt-4"
              loading={syncing || loading}
              data={filteredData.result}
              params={params}
              selectedRowKeys={selectedRowKeys}
              selectionChange={handleSelectionChange}
              getCheckboxProps={getCheckboxProps}
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