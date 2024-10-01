import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { Badge } from '@lockerpm/design';

import {
  LockOutlined,
  FolderOutlined
} from "@ant-design/icons";

import itemsComponents from "../../../components/items";
import commonComponents from "../../../components/common";
import shareComponents from "../../../components/share";
import sharedWithMeComponents from "./components/shared-with-me";

import commonServices from "../../../services/common";
import sharingServices from "../../../services/sharing";

import common from "../../../utils/common";
import global from "../../../config/global";

const SharedWithMe = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { PageHeader }  = commonComponents;
  const { Pagination } = itemsComponents;

  const {
    MenuTabs,
    NoItem,
  }  = shareComponents;

  const {
    Filter,
    ShareCiphers,
    ShareFolders,
  }  = sharedWithMeComponents;

  const menuTypes = global.constants.MENU_TYPES
  const currentPage = common.getRouterByLocation(location);

  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections)
  const invitations = useSelector((state) => state.share.invitations)

  const [menuType, setMenuType] = useState(currentPage.query?.menu_type || menuTypes.CIPHERS);
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: '',
  });

  const invitedCount = useMemo(() => {
    const invitedItems = invitations.filter((i) => i.status === global.constants.STATUS.INVITED)
    return {
      cipher: invitedItems.filter((i) => i.item_type === 'cipher').length,
      folder: invitedItems.filter((i) => i.item_type === 'folder').length
    }
  }, [invitations])

  const items = useMemo(() => {
    if (menuType === menuTypes.CIPHERS) {
      return [
        ...invitations.filter((i) => i.item_type === 'cipher'),
        ...allCiphers
          .filter((c) => !c.isDeleted && !c.collectionIds.length && !common.isOwner(c))
          .map((c) => ({
            ...c,
            share_type: common.isChangeCipher(c)
              ? global.constants.PERMISSION.EDIT
              : (c.viewPassword ? global.constants.PERMISSION.VIEW : global.constants.PERMISSION.ONLY_USE)
          }))
      ]
    }
    return [
      ...invitations.filter((i) => i.item_type === 'folder'),
      ...allCollections
        .filter((c) => !common.isOwner(c))
        .map((c) => ({
          ...c,
          share_type: common.isChangeCipher(c)
            ? global.constants.PERMISSION.EDIT
            : (!c.hidePasswords ? global.constants.PERMISSION.VIEW : global.constants.PERMISSION.ONLY_USE)
        }))
    ]
  }, [allCiphers, allCollections, invitations, menuType])

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
        (f) => params.searchText ? f.name?.toLowerCase().includes(params.searchText.toLowerCase() || '') : true
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

  const handleUpdateInvitation = async (item, status) => {
    await sharingServices.update_sharing_invitation(item.id, { status }).then(async () => {
      if (status === global.constants.STATUS_ACTION.ACCEPT) {
        global.pushSuccess(t('notification.success.sharing.accepted'))
      } else {
        global.pushSuccess(t('notification.success.sharing.rejected'))
      }
      await common.getInvitations();
    });
  }

  const handleLeaveShare = async (item) => {
    global.confirm(async () => {
      try {
        await commonServices.leave_share(item)
        global.pushSuccess(t('notification.success.sharing.leave_group_success'));
        if (item.isCollection) {
          const collectionCiphers = allCiphers.filter((c) => c.folderId === item.id)
          await global.jsCore.cipherService.delete(collectionCiphers.map(c => c.id))
          await global.jsCore.collectionService.delete(item.id)
          await common.getAllCollections();
        } else {
          await global.jsCore.cipherService.delete([item.id])
        }
        await common.getAllCollections();
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
      } catch (error) {
        global.pushError(error)
      }
    }, {
      title: t('common.warning'),
      content: t('shares.leave_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    });
  }

  return (
    <div
      className="vault layout-content"
      onScroll={(e) => common.scrollEnd(e, params, filteredData.total, setParams)}
    >
      <PageHeader
        title={t('sidebar.shared_with_me')}
        total={filteredData.total}
        actions={[]}
      />
      <MenuTabs
        menu={menuType}
        menus={[
          {
            key: menuTypes.CIPHERS,
            label: <span>
              <span>{t('common.items')}</span>
              <Badge className="ml-2" count={invitedCount.cipher} />
            </span>,
            icon: <LockOutlined />
          },
          {
            key: menuTypes.FOLDERS,
            label: <span>
              <span>{t('common.folders')}</span>
              <Badge className="ml-2" count={invitedCount.folder} />
            </span>,
            icon: <FolderOutlined />
          }
        ]}
        onChange={(v) => handleChangeMenuType(v)}
      />
      {
        !isEmpty && <Filter
          key={menuType}
          params={params}
          loading={syncing}
          setParams={(v) => setParams({ ...v, page: 1 })}
        />
      }
      {
        filteredData.total == 0 && <NoItem
          className={'mt-4'}
          loading={syncing}
          isEmpty={isEmpty}
        />
      }
      {
        filteredData.total > 0 && <>
          {
            menuType === menuTypes.CIPHERS && <ShareCiphers
              loading={syncing}
              params={params}
              filteredData={filteredData}
              onLeave={handleLeaveShare}
              onUpdateStatus={handleUpdateInvitation}
            />
          }
          {
            menuType === menuTypes.FOLDERS && <ShareFolders
              loading={syncing}
              params={params}
              filteredData={filteredData}
              onLeave={handleLeaveShare}
              onUpdateStatus={handleUpdateInvitation}
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
    </div>
  );
}

export default SharedWithMe;