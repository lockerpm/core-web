import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import {
  LockOutlined,
  FolderOutlined,
  ShareAltOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { AdminHeader } from "../../../components";

import MenuTabs from "./components/MenuTabs";
import NoItem from "./components/NoItem";
import FormData from "./components/FormData";
import Filter from "../vault/components/Filter";
import InAppShares from "./components/in-app-shares/index";
import QuickShares from "./components/quick-shares";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../utils/common";
import global from "../../../config/global";

import { CipherType } from "../../../core-js/src/enums";

const menuTypes = {
  CIPHERS: 'ciphers',
  FOLDERS: 'folders',
  QUICK_SHARES: 'quick-shares'
}

const MySharedItems = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);

  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections)
  const invitations = useSelector((state) => state.share.invitations)
  const sends = useSelector((state) => state.share.sends)

  const [menuType, setMenuType] = useState(currentPage.query?.menu_type || menuTypes.CIPHERS);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: '',
  });

  const items = useMemo(() => {
    if (menuType === menuTypes.CIPHERS) {
      return allCiphers
        .filter((c) => ![CipherType.MasterPassword, CipherType.TOTP].includes(c.type))
        .filter((c) => !c.isDeleted && !c.collectionIds.length && common.isOwner(c))
        .filter((c) => c.organizationId && common.isCipherShared(c.organizationId))
    }
    if (menuType === menuTypes.FOLDERS) {
      return allCollections
        .filter((c) => c.id)
        .filter((c) => common.isOwner(c))
    }
    return sends.map((s) => ({
      ...s,
    }))
  }, [allCiphers, allCollections, invitations, sends, menuType])

  const isEmpty = useMemo(() => {
    return items.length === 0
  }, [items])

  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      searchText: currentPage?.query?.searchText,
    })
  }, [currentPage?.query?.searchText, syncing])

  const filteredData = useMemo(() => {
    return common.paginationAndSortData(
      items,
      params,
      params.orderField,
      params.orderDirection,
      [
        (f) => params.searchText ? f.name?.toLowerCase().includes(params.searchText?.toLowerCase() || '') : true
      ]
    )
  }, [items, JSON.stringify(params)])

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

  const handleChangeMenuType = (v) => {
    setMenuType(v);
    setParams({ ...params, page: 1, searchText: null })
    global.navigate(currentPage.name, {}, { menu_type: v });
  }

  const handleOpenForm = (item = null) => {
    setSelectedItem(item);
    setFormVisible(true);
  }

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <AdminHeader
        title={t('sidebar.my_shared_items')}
        total={filteredData.total}
        actions={[
          {
            key: 'add',
            label: t('button.new_share'),
            type: 'primary',
            icon: <PlusOutlined />,
            disabled: syncing,
            click: () => handleOpenForm()
          }
        ]}
      />
      <MenuTabs
        menu={menuType}
        menus={[
          {
            key: menuTypes.CIPHERS,
            label: t('shares.in_app_shares.items'),
            icon: <LockOutlined />
          },
          {
            key: menuTypes.FOLDERS,
            label: t('shares.in_app_shares.folders'),
            icon: <FolderOutlined />
          },
          {
            key: menuTypes.QUICK_SHARES,
            label: t('shares.in_app_shares.quick_shares'),
            icon: <ShareAltOutlined />
          }
        ]}
        onChange={(v) => handleChangeMenuType(v)}
      />
      {
        !isEmpty && <Filter
          key={menuType}
          params={params}
          loading={syncing}
          menuType={menuType}
          menuTypes={menuTypes}
          setMenuType={(v) => {
            setMenuType(v);
            global.navigate(currentPage.name, {}, { menu_type: v });
          }}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        filteredData.total == 0 && <NoItem
          className={'mt-4'}
          loading={syncing}
          isEmpty={isEmpty}
          isSharedWithMe={false}
          isQuickShares={menuType === menuTypes.QUICK_SHARES}
        />
      }
      {
        filteredData.total > 0 && <>
          {
            menuType !== menuTypes.QUICK_SHARES && <InAppShares
              loading={syncing}
              params={params}
              isFolder={menuType === menuTypes.FOLDERS}
              filteredData={filteredData}
              onUpdate={handleOpenForm}
              onStopSharing={() => {}}
              onUpdateStatus={() => {}}
            />
          }
          {
            menuType === menuTypes.QUICK_SHARES && <QuickShares
              loading={syncing}
              params={params}
              filteredData={filteredData}
              onStopSharing={() => {}}
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
        menuType={menuType}
        menuTypes={menuTypes}
        onClose={() => {
          setFormVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default MySharedItems;