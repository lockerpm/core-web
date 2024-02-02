import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import { Breadcrumb } from '@lockerpm/design';

import itemsComponents from '../items';

import common from '../../utils/common';
import global from '../../config/global';

import '../css/breadcrumb.scss';

const { RouterLink } = itemsComponents;

function LayoutBreadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();

  const [menus, setMenus] = useState([]);
  const locale = useSelector((state) => state.system.locale);
  const currentPage = useSelector((state) => state.system.currentPage);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCiphers = useSelector((state) => state.cipher.allCiphers);
  const currentEnterprise = useSelector((state) => state.enterprise.currentEnterprise);

  useEffect(() => {
    if (location) {
      const brRouters = common.getRoutersByLocation(location).map((r) => ({ ...r, label: t(r.label) }));
      const lastRouter = brRouters.slice(-1)[0];
      if (lastRouter) {
        let lastRouters = [lastRouter]
        if (lastRouter.children) {
          const children = lastRouter.children.find((m) => m.key === currentPage.name)
          lastRouters = [
            {
              ...lastRouter.children[0],
              label: t(lastRouter.label)
            },
            {
              ...children,
              label: t(children.label)
            }
          ]
        }
        if (lastRouter.parent && !common.isEmpty(lastRouter.params)) {
          let label = t(lastRouter.label) || t('common.detail')
          if (currentEnterprise) {
            setMenus([
              {
                router: global.keys.ENTERPRISE_DASHBOARD,
                label: currentEnterprise.name,
              },
              ...brRouters.filter((m) => m.key !== lastRouter.key),
              {
                ...lastRouter,
                label
              }
            ]);
          } else {
            if (lastRouter.parent == global.keys.FOLDERS) {
              label = allFolders.find((f) => f.id == lastRouter.params.folder_id)?.name || t('common.detail')
            } else if (lastRouter.params.cipher_id) {
              label = allCiphers.find((f) => f.id == lastRouter.params.cipher_id)?.name || t('common.detail')
            }
            setMenus([
              ...brRouters.filter((m) => m.key !== lastRouter.key),
              {
                ...lastRouter,
                label
              }
            ]);
          }
        } else {
          setMenus([
            ...brRouters.filter((m) => m.key !== lastRouter.key),
            ...lastRouters
          ]);
        }
      } else {
        setMenus(brRouters);
      }
    }
  }, [location, currentPage, allFolders, allCiphers, locale, currentEnterprise])

  const items = useMemo(() => {
    const breadcrumbRouters = menus.map((m, index) => ({
      key: index,
      title: index === menus.length - 1 ? <span>
        {m.label}
      </span> : <RouterLink
        label={m.label}
        routerName={m.router || m.key}
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
  }, [menus, currentPage, userInfo])

  return (
    <Breadcrumb className='flex items-center' items={items} />
  )
}

export default LayoutBreadcrumb;