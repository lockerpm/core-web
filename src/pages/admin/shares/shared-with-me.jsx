import React, { useEffect, useState, useMemo } from "react";
import { } from '@lockerpm/design';
import { } from "@ant-design/icons";
import { AdminHeader } from "../../../components";

import NoCipher from "./components/NoCipher";
import Filter from "./components/Filter";
import ShareCiphers from "./components/shared-with-me/Ciphers";
import ShareFolders from "./components/shared-with-me/Folders";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import common from "../../../utils/common";
import global from "../../../config/global";

import commonServices from "../../../services/common";
import sharingServices from "../../../services/sharing";

const menuTypes = {
  CIPHERS: 'ciphers',
  FOLDERS: 'folders'
}

const SharedWithMe = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = common.getRouterByLocation(location);

  const syncing = useSelector((state) => state.sync.syncing);
  const isMobile = useSelector((state) => state.system.isMobile)
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allCollections = useSelector((state) => state.collection.allCollections)
  const invitations = useSelector((state) => state.share.invitations)

  const [menuType, setMenuType] = useState(currentPage.query?.menu_type || menuTypes.CIPHERS);
  const [callingAPI, setCallingAPI] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    size: global.constants.PAGE_SIZE,
    orderField: 'revisionDate',
    orderDirection: 'desc',
    searchText: '',
  });

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
        (f) => params.searchText ? f.name.toLowerCase().includes(params.searchText.toLowerCase() || '') : true
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

  const handleUpdateInvitation = async (item, status) => {
    await sharingServices.update_sharing_invitation(item.id, { status }).then(async () => {
      if (status === global.constants.STATUS_ACTION.ACCEPT) {
        global.pushSuccess(t('notification.success.sharing.accepted'))
      } else {
        global.pushSuccess(t('notification.success.sharing.rejected'))
      }
      await commonServices.get_invitations();
    });
  }

  const handleLeaveShare = async (item) => {
    global.confirmDelete(async () => {
      setCallingAPI(true)
      try {
        await commonServices.leave_share(item)
        global.pushSuccess(t('notification.success.sharing.leave_group_success'));
        if (filteredData.length === 1 && params.page > 1) {
          setParams({
            ...params,
            page: params.page - 1
          })
        }
      } catch (error) {
        global.pushError(error)
      }
      setCallingAPI(false)
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
      <AdminHeader
        title={t('sidebar.shared_with_me')}
        total={filteredData.total}
        actions={[]}
      />
      {
        !isEmpty && <Filter
          className={'mt-2'}
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
        filteredData.total == 0 && <NoCipher
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
              onUpdateStatus={handleUpdateInvitation}
              onLeave={handleLeaveShare}
            />
          }
          {
            menuType === menuTypes.FOLDERS && <ShareFolders
              loading={syncing}
              params={params}
              filteredData={filteredData}
              onUpdateStatus={handleUpdateInvitation}
              onLeave={handleLeaveShare}
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