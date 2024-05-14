import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { } from '@lockerpm/design';

import {
  LockOutlined,
  FolderOutlined,
  ShareAltOutlined,
  PlusOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../components/items";
import commonComponents from "../../../components/common";
import shareComponents from "../../../components/share";
import vaultComponents from "../vault/components";
import inAppSharesComponents from "./components/in-app-shares";
import quickSharesComponents from "./components/quick-shares";

import { CipherType } from "../../../core-js/src/enums";

import commonServices from "../../../services/common";

import common from "../../../utils/common";
import global from "../../../config/global";

const MySharedItems = (props) => {
  const { PageHeader }  = commonComponents;
  const { Filter }  = vaultComponents;
  const { Pagination } = itemsComponents;
  const {
    MenuTabs,
    NoItem,
    FormData,
    QuickShareReview
  }  = shareComponents;
  const InAppListData = inAppSharesComponents.ListData;
  const InAppTableData = inAppSharesComponents.TableData;
  const QuickListData = quickSharesComponents.ListData;
  const QuickTableData = quickSharesComponents.TableData;

  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuTypes = global.constants.MENU_TYPES

  const currentPage = common.getRouterByLocation(location);

  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections)
  const invitations = useSelector((state) => state.share.invitations)
  const sends = useSelector((state) => state.share.sends)

  const [menuType, setMenuType] = useState(currentPage.query?.menu_type || menuTypes.CIPHERS);
  const [formVisible, setFormVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sendId, setSendId] = useState(null);

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
  }, [allCiphers, allCollections, invitations, sends, menuType, syncing])

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

  const handleOpenReview = (sendId) => {
    setSendId(sendId);
    setReviewVisible(true);
  }

  const stopSharingItem = async (item) => {
    try {
      if (menuType === menuTypes.CIPHERS) {
        await commonServices.stop_sharing_cipher(item);
      } else if (menuType === menuTypes.FOLDERS) {
        await commonServices.stop_sharing_folder(item);
      } else {
        await commonServices.stop_quick_share(item)
      }
      global.pushSuccess(t('notification.success.sharing.stop_share_success'))
    } catch (error) {
      global.pushError(error)
    }
  }

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <PageHeader
        title={t('sidebar.my_shared_items')}
        total={filteredData.total}
        actions={[
          {
            key: 'add',
            label: t('button.new_share'),
            type: 'primary',
            icon: <PlusOutlined />,
            hide: isEmpty,
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
          setParams={(v) => setParams({ ...v, page: 1 })}
          setMenuType={(v) => {
            setMenuType(v);
            global.navigate(currentPage.name, {}, { menu_type: v });
          }}
        />
      }
      {
        filteredData.total == 0 && <NoItem
          className={'mt-4'}
          loading={syncing}
          isEmpty={isEmpty}
          isSharedWithMe={false}
          isQuickShares={menuType === menuTypes.QUICK_SHARES}
          onCreate={() => handleOpenForm()}
        />
      }
      {
        filteredData.total > 0 && <>
          {
            menuType !== menuTypes.QUICK_SHARES && <div
              className="in-app-shares"
            >
              {
                isMobile ? <InAppListData
                  className="mt-4"
                  loading={syncing}
                  data={filteredData.result}
                  params={params}
                  isFolder={menuType === menuTypes.FOLDERS}
                  onUpdate={handleOpenForm}
                  onStopSharing={stopSharingItem}
                /> : <InAppTableData
                  className="mt-4"
                  loading={syncing}
                  data={filteredData.result}
                  params={params}
                  isFolder={menuType === menuTypes.FOLDERS}
                  onUpdate={handleOpenForm}
                  onStopSharing={stopSharingItem}
                />
              }
            </div>
          }
          {
            menuType === menuTypes.QUICK_SHARES && <div
              className="quick-shares"
            >
              {
                isMobile ? <QuickListData
                  className="mt-4"
                  loading={syncing}
                  data={filteredData.result}
                  params={params}
                  isFolder={false}
                  onStopSharing={stopSharingItem}
                /> : <QuickTableData
                  className="mt-4"
                  loading={syncing}
                  data={filteredData.result}
                  params={params}
                  isFolder={false}
                  onStopSharing={stopSharingItem}
                />
              }
            </div>
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
        onChangeMenuType={handleChangeMenuType}
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

export default MySharedItems;