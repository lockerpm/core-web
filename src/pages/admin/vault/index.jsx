import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import { AdminHeader, NoData, Pagination } from "../../../components";

import Filter from "./components/Filter";
import TableData from "./components/TableData";
import BoxData from "./components/BoxData";
import FormData from "./components/FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  getRouterByLocation,
  paginationAndSortData,
  scrollEnd
} from '../../../utils/common';

import global from "../../../config/global";

const Inventory = (props) => {
  const { } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = getRouterByLocation(location);
  const syncing = useSelector((state) => state.core.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const isReadOnly = useSelector((state) => state.project.isReadOnly)

  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [total, setTotal] = useState(0);
  const [secrets, setSecrets] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    sortBy: 'creationDate',
    sortType: 'descend',
    key: '',
    environmentId: null
  });

  useEffect(() => {
    fetchData()
  }, [syncing, currentPage.params?.project_id])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      key: currentPage?.query?.key,
    })
  }, [currentPage?.query?.key])

  const filteredData = useMemo(() => {
    return paginationAndSortData(
      secrets,
      params,
      params.sortBy,
      params.sortType,
      []
    )
  }, [secrets, JSON.stringify(params)])
  
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

  const fetchData = async () => {
    const secrets = await secretServices.list_ciphers(currentPage?.params?.project_id);
    setTotal(secrets.length);
    setSecrets(secrets);
  }

  const handleOpenForm = (item = null) => {
    setSelectedItem(item);
    setFormVisible(true)
  }

  const deleteItem = (secret) => {
    global.confirmDelete(() => {
      secretServices.remove(currentPage?.params?.project_id, secret.id).then(async () => {
        global.pushSuccess(t('notification.success.secret.deleted'));
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
      className="secrets layout-content"
      onScroll={(e) => scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t('secrets.title')}
        subtitle={t('secrets.description')}
        docLink={'/'}
        docLabel={t('secrets.doc')}
        actions={[
          {
            key: 'add',
            label: t('secrets.new'),
            type: 'primary',
            icon: <PlusOutlined />,
            hide: isReadOnly,
            click: () => handleOpenForm()
          }
        ]}
      />
      {
        <Filter
          className={'mt-6'}
          params={params}
          environments={environments}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        filteredData.total == 0 ? <NoData
          loading={syncing}
          className={'mt-6'}
        /> : <>
          {
            isMobile ? <BoxData
              className="mt-4"
              loading={syncing}
              data={filteredData.result}
              params={params}
              environments={environments}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
            /> : <TableData
              className="mt-4"
              loading={syncing}
              data={filteredData.result}
              params={params}
              environments={environments}
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
        allItems={secrets}
        environments={environments}
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}

export default Inventory;