import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Menu,
  Badge
} from '@lockerpm/design';

import {
  LeftOutlined,
} from '@ant-design/icons'

import common from '../../../utils/common';
import global from '../../../config/global';

import '../css/sidebar-center.scss';

function SidebarCenter(props) {
  const { collapsed, onClose = () => {} } = props
  const currentPage = useSelector((state) => state.system.currentPage);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const invitations = useSelector((state) => state.share.invitations);

  const [openKeys, setOpenKeys] = useState([])

  const { t } = useTranslation();

  const menus = useMemo(() => {
    return global.menus.ADMIN_MENUS
  }, [])

  const invitedCount = useMemo(() => {
    return invitations.filter((i) => i.status === global.constants.STATUS.INVITED).length
  }, [invitations])

  const backMenu = useMemo(() => {
    if (currentPage) {
      const currentMenu = menus.find((m) => {
        if (currentPage.parent) {
          return m.key === currentPage.parent && m.parent && !m.isChildren
        }
        return m.key === currentPage.name && m.parent && !m.isChildren
      })
      if (currentMenu) {
        let backRouterKey = global.keys.VAULT
        if (currentMenu.parent === global.keys.ENTERPRISE) {
          if (userInfo.is_super_admin) {
            backRouterKey = global.keys.ENTERPRISES
          }
        }
        return {
          ...currentMenu,
          back: {
            ...common.getRouterByName(backRouterKey),
            label: t('common.back'),
            icon: <LeftOutlined />
          }
        }
      }
      return null
    }
    return null
  }, [currentPage, menus])

  const sidebarMenus = useMemo(() => {
    if (backMenu) {
      return menus.filter((m) => m.parent === backMenu.parent)
    }
    return menus
      .filter((m) => !m.parent)
      .map((m) => {
        const children = menus
          .filter((c) => c.parent === m.key && c.isChildren)
          .map((ch) => ({
            key: ch.key,
            label: ch.label,
          }))
        return {
          ...m,
          children: children.length > 0 ? children : null
        }
      })
  }, [backMenu, menus])

  useEffect(() => {
    setOpenKeys(sidebarMenus.filter((m) => m.children).map((m) => m.key))
  }, [sidebarMenus])

  const handleMenuClick = (menu) => {
    const menuInfo = menus.find((m) => m.key === menu.key)
    let routerInfo = {}
    if (menuInfo) {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menuInfo.router || r.name === menuInfo.key)
    } else {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menu.key)
    }
    if (backMenu?.parent === global.keys.ENTERPRISE) {
      global.navigate(routerInfo.name, { enterprise_id: currentPage?.params?.enterprise_id });
    } else {
      global.navigate(routerInfo.name);
    }
    onClose();
  }

  return (
    <div className={'admin-layout-sidebar-center'}>
      {
        backMenu && <Menu
          defaultOpenKeys={[]}
          selectedKeys={[]}
          mode="inline"
          collapsed={collapsed.toString()}
          items={[backMenu?.back]}
          onClick={handleMenuClick}
        />
      }
      <Menu
        openKeys={openKeys}
        selectedKeys={[currentPage?.parent || currentPage?.key]}
        mode="inline"
        collapsed={collapsed.toString()}
        items={sidebarMenus.map((m) => ({
          key: m.key,
          icon: m.icon,
          label: m.key === global.keys.SHARES && !openKeys.includes(global.keys.SHARES) ? <div className='w-full'>
            <span className='mr-2'>{t(m.label)}</span>
            <Badge count={invitedCount} />
          </div> : t(m.label),
          children: m.children ? m.children.map((ch) => ({
            key: ch.key,
            label: ch.key === global.keys.SHARED_WITH_ME ? <div className='w-full'>
              <span className='mr-2'>{t(ch.label)}</span>
              <Badge count={invitedCount} />
            </div> : t(ch.label),
          })) : null,
        }))}
        onClick={handleMenuClick}
        onOpenChange={setOpenKeys}
      />
    </div>
  );
}

export default SidebarCenter;
