import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Badge } from '@lockerpm/design';
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
  const invitations = useSelector((state) => state.share.invitations);

  const [openKeys, setOpenKeys] = useState([])

  const { t } = useTranslation();

  const menus = useMemo(() => {
    return global.menus.ADMIN_MENUS
  }, [])

  const invitedCount = useMemo(() => {
    return invitations.filter((i) => i.status === global.constants.STATUS.INVITED).length
  }, [invitations])

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
  }, [currentMenu, menus])

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
