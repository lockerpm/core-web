import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
  Menu,
  Badge
} from '@lockerpm/design';

import {
  LeftOutlined,
} from '@ant-design/icons'

import common from '../../utils/common';
import global from '../../config/global';

import '../css/sidebar-center.scss';

function SidebarCenter(props) {
  const { t } = useTranslation();
  const location = useLocation();
  
  const {
    collapsed,
    showBottom,
    setRespCollapsed = () => {},
    onClose = () => {}
  } = props
  const currentPage = useSelector((state) => state.system.currentPage);
  const locale = useSelector((state) => state.system.locale);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const invitations = useSelector((state) => state.share.invitations);
  const currentEnterprise = useSelector((state) => state.enterprise.currentEnterprise);

  const [openKeys, setOpenKeys] = useState([])

  const menus = useMemo(() => {
    return common.allMenus();
  }, [])

  useEffect(() => {
    const cMenu = menus.find((m) => m.key === (currentPage?.parent || currentPage?.key));
    if (cMenu && cMenu.isChildren && !collapsed) {
      setOpenKeys([cMenu.parent]);
    }
  }, [menus, currentPage, collapsed])

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
  }, [currentPage, menus, locale])

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

  const brMenus = useMemo(() => {
    const rMenus = common.getRoutersByLocation(location)
    if (currentEnterprise) {
      return [
        {
          name: global.keys.ENTERPRISE_DASHBOARD,
          label: currentEnterprise.name
        },
        ...rMenus
      ]
    }
    return rMenus
  }, [
    location,
    currentPage,
    currentEnterprise,
  ])

  const selectedKey = useMemo(() => {
    const selectedMenu = menus.find((m) => m.key === currentPage?.parent || m.key === currentPage?.key);
    if (selectedMenu) {
      return selectedMenu?.key
    }
    const sidebarMenu = sidebarMenus.find((m) => m.key === brMenus[0]?.key);
    if (sidebarMenu?.children?.length > 0) {
      return sidebarMenu.children.find((c) => brMenus.map((brm) => brm.key).includes(c.key))?.key
    }
    return sidebarMenu.key;
  }, [brMenus, currentPage, sidebarMenus])

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
    <div className={`admin-layout-sidebar-center ${showBottom ? 'show-bottom' : ''}`}>
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
        selectedKeys={[selectedKey]}
        mode="inline"
        collapsed={collapsed.toString()}
        triggerSubMenuAction='click'
        items={sidebarMenus.map((m) => ({
          key: m.key,
          icon: m.icon,
          className: m.className,
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
