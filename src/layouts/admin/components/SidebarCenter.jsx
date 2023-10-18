import React, { useMemo } from 'react';
import { Menu } from '@lockerpm/design';
import '../css/components/SidebarCenter.scss';
import { useSelector } from 'react-redux';
import {
  LeftOutlined,
} from '@ant-design/icons'
import common from '../../../utils/common';

import { useTranslation } from "react-i18next";
import global from '../../../config/global';

function SidebarCenter(props) {
  const { collapsed } = props
  const currentPage = useSelector((state) => state.system.currentPage);

  const { t } = useTranslation();

  const menus = useMemo(() => {
    return global.menus.ADMIN_MENUS
  }, [])

  const currentMenu = useMemo(() => {
    if (currentPage) {
      return menus.find((m) => {
        if (currentPage.parent) {
          return m.key === currentPage.parent && m.parent && !m.isChildren
        }
        return m.key === currentPage.name && m.parent && !m.isChildren
      })
    }
    return null
  }, [currentPage, menus])

  const sidebarMenus = useMemo(() => {
    if (currentMenu) {
      return menus.filter((m) => m.parent === currentMenu.parent)
    }
    return menus
      .filter((m) => !m.parent)
      .map((m) => {
        const children = menus.filter((c) => c.parent === m.key && c.isChildren).map((ch) => ({ key: ch.key, label: ch.label }))
        return { ...m, children: children.length > 0 ? children : null }
      })
  }, [currentMenu, menus])

  const handleMenuClick = (menu) => {
    const menuInfo = menus.find((m) => m.key === menu.key)
    let routerInfo = {}
    if (menuInfo) {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menuInfo.router || r.name === menuInfo.key)
    } else {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menu.key)
    }
    global.navigate(routerInfo.name);
  }

  return (
    <div className={'admin-layout-sidebar-center'}>
      {
        currentMenu && <Menu
          defaultOpenKeys={[]}
          selectedKeys={[]}
          mode="inline"
          collapsed={collapsed.toString()}
          items={[{
            ...common.getRouterByName('VAULT'),
            label: t('common.back'),
            icon: <LeftOutlined />
          }]}
          onClick={handleMenuClick}
        />
      }
      <Menu
        defaultOpenKeys={sidebarMenus.filter((m) => m.children).map((m) => m.key)}
        selectedKeys={[currentPage?.parent || currentPage?.key]}
        mode="inline"
        collapsed={collapsed.toString()}
        items={sidebarMenus.map((m) => ({
          key: m.key,
          label: m.label,
          icon: m.icon,
          children: m.children,
        }))}
        onClick={handleMenuClick}
      />
    </div>
  );
}

export default SidebarCenter;
