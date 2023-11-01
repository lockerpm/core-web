import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { PlusOutlined } from "@ant-design/icons";
import { AdminHeader, Pagination } from "../../../components";

import NoFolder from "./components/NoFolder";
import Filter from "./components/Filter";
import TableData from "./components/TableData";
import BoxData from "./components/BoxData";
import FormData from "./components/FormData";
import ShareFormData from "../shares/components/FormData";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../utils/common";

import global from "../../../config/global";
import commonServices from "../../../services/common";

const Folders = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);
  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)

  const [formVisible, setFormVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: '',
  });

  const isEmpty = useMemo(() => {
    return [...allCollections, ...allFolders].length === 0
  }, [allFolders, allCollections])


  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(
      [
        ...allCollections,
        ...allFolders
      ],
      params,
      params.orderField,
      params.orderDirection,
      [
        (f) => f.id,
        (f) => params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || '') : true
      ]
    )
  }, [allFolders, allCollections, JSON.stringify(params)])

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

  const handleOpenForm = (item = null, cloneMode = false) => {
    setSelectedItem(item);
    setFormVisible(true);
  }

  const handleOpenShareForm = (item = null) => {
    setSelectedItem(item);
    setShareVisible(true);
  }

  const stopSharing = async (collection) => {
    try {
      await commonServices.stop_sharing_folder(collection);
      global.pushSuccess(t('notification.success.folder.updated'))
    } catch (error) {
      global.pushError(error)
    }
  }

  const deleteItem = (folder) => {
    global.confirm(async () => {
      try {
        if (folder.organizationId) {
          await commonServices.delete_collection(folder)
        } else {
          await commonServices.delete_folder(folder)
        }
        global.pushSuccess(t('notification.success.folder.deleted'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
      } catch (error) {
        global.pushError(error)
      }
    });
  };

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t('inventory.all_folders')}
        total={filteredData.total}
        actions={[
          {
            key: 'add',
            label: t('button.new_folder'),
            type: 'primary',
            icon: <PlusOutlined />,
            disabled: syncing,
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
        filteredData.total == 0 ? <NoFolder
          className={'mt-4'}
          loading={syncing}
          isEmpty={isEmpty}
          onCreate={() => handleOpenForm()}
        /> : <>
          {
            isMobile ? <BoxData
              className="mt-4"
              loading={syncing}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
              onStop={stopSharing}
              onShare={handleOpenShareForm}
            /> : <TableData
              className="mt-4"
              loading={syncing}
              data={filteredData.result}
              params={params}
              onUpdate={handleOpenForm}
              onDelete={deleteItem}
              onStop={stopSharing}
              onShare={handleOpenShareForm}
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
      <ShareFormData
        visible={shareVisible}
        item={selectedItem}
        menuType={global.constants.MENU_TYPES.FOLDERS}
        menuTypes={global.constants.MENU_TYPES}
        onClose={() => {
          setShareVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default Folders;