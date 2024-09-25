import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Breadcrumb
} from '@lockerpm/design';

import itemsComponents from '../items';

import common from '../../utils/common';
import global from '../../config/global';

function LayoutBreadcrumb() {
  const { RouterLink } = itemsComponents;
  const { t } = useTranslation();
  const location = useLocation();

  const locale = useSelector((state) => state.system.locale);
  const currentPage = useSelector((state) => state.system.currentPage);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCollections = useSelector((state) => state.collection.allCollections);
  const sends = useSelector((state) => state.share.sends);
  const currentEnterprise = useSelector((state) => state.enterprise.currentEnterprise);

  const originCipher = useMemo(() => {
    return allCiphers.find((d) => d.id === currentPage?.params?.cipher_id)
  }, [allCiphers, currentPage])

  const originFolder = useMemo(() => {
    return [...allFolders, ...allCollections].find((c) => c.id === currentPage?.params?.folder_id)
  }, [allFolders, allCollections, currentPage])

  const originSend = useMemo(() => {
    return sends.find((d) => d.id === currentPage?.params?.send_id)
  }, [sends, currentPage])

  const getMenuLabel = (menu) => {
    if (!menu.label) {
      const lastParam = menu.path?.split('/:').slice(-1)[0]
      if (lastParam?.includes('cipher_id')) {
        return originCipher?.name || t('common.detail')
      }
      if (lastParam?.includes('folder_id')) {
        return originFolder?.name || t('common.detail')
      }
      if (lastParam?.includes('send_id')) {
        return originSend?.cipher?.name || t('common.detail')
      }
      if (lastParam?.includes('member_id')) {
        return t('common.detail')
      }
    }
    return t(menu.label)
  }

  const brMenus = useMemo(() => {
    const menus = common.getRoutersByLocation(location).map((menu) => ({
      ...menu,
      label: getMenuLabel(menu)
    }))
    if (currentEnterprise) {
      return [
        {
          name: global.keys.ENTERPRISE_DASHBOARD,
          label: currentEnterprise.name
        },
        ...menus
      ]
    }
    return menus
  }, [
    locale,
    location,
    currentPage,
    currentEnterprise,
    sends,
    allCiphers,
    allFolders,
    allCollections,
  ])

  const items = useMemo(() => {
    const breadcrumbRouters = brMenus.map((m, index) => ({
      key: index,
      title: index === brMenus.length - 1 ? <span>
        {m.label}
      </span> : <RouterLink
        label={m.label}
        routerName={m.name || m.key}
        routerParams={currentPage.params}
        routerQuery={currentPage.query}
        maxWidth={120}
      />
    }))
    if (currentPage.name.includes('ACCOUNT_')) {
      return [
        {
          key: 'account',
          title: <span>
            {userInfo.full_name}
          </span>
        },
        ...breadcrumbRouters
      ]
    }
    return breadcrumbRouters
  }, [
    brMenus,
    currentPage,
    userInfo
  ])

  return (
    <Breadcrumb className='flex items-center' items={items} />
  )
}

export default LayoutBreadcrumb;