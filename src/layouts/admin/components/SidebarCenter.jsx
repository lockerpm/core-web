import React, { useMemo } from 'react';
import { Menu } from '@lockerpm/design';
import '../css/components/SidebarCenter.scss';
import { useSelector } from 'react-redux';
import {
  LeftOutlined,
} from '@ant-design/icons'
import { getRouterByName } from '../../../utils/common';

import { useTranslation } from "react-i18next";
import global from '../../../config/global';

function SidebarCenter(props) {
  const { collapsed } = props
  const currentPage = useSelector((state) => state.system.currentPage);
  const wsRole = useSelector((state) => state.workspace.wsRole);
  const selectedWorkspace = useSelector((state) => state.workspace.selectedWorkspace);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const workspaces = useSelector((state) => state.workspace.workspaces);

  const { t } = useTranslation();

  const menus = useMemo(() => {
    let menusInfo = []
    if (selectedProject) {
      menusInfo = global.menus.ADMIN_MENUS.filter(
        ((m) => !m.pRoles || m.pRoles.includes(selectedProject?.role))
      )
    } else {
      menusInfo = global.menus.ADMIN_MENUS.filter(
        ((m) => !m.wsRoles || m.wsRoles.includes(wsRole))
      )
    }
    return menusInfo
  }, [wsRole, selectedProject])

  const currentMenu = useMemo(() => {
    if (currentPage) {
      return menus.find((m) => {
        if (m.children) {
          return !!m.children.find((c) => c.key === currentPage.name)
        }
        if (currentPage.parent) {
          return m.key === currentPage.parent && m.parent
        }
        return m.key === currentPage.name && m.parent
      })
    }
    return null
  }, [currentPage, menus])

  const sidebarMenus = useMemo(() => {
    if (currentMenu) {
      return menus.filter((m) => m.parent === currentMenu.parent)
    }
    return menus.filter((m) => !m.parent)
  }, [currentMenu, menus])

  const handleMenuClick = (menu) => {
    const menuInfo = menus.find((m) => m.key === menu.key)
    let routerInfo = {}
    if (menuInfo) {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menuInfo.router || r.name === menuInfo.key)
    } else {
      routerInfo = global.routers.ADMIN_ROUTERS.find((r) => r.name === menu.key)
    }
    global.navigate(routerInfo.name, {
      workspace_id: currentPage.params?.workspace_id || workspaces[0]?.id,
      project_id: currentPage.params?.project_id || null,
    });
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
            ...getRouterByName('PROJECTS', { workspace_id: currentPage.params?.workspace_id || selectedWorkspace?.id || workspaces[0]?.id  }),
            label: t('common.back'),
            icon: <LeftOutlined />
          }]}
          onClick={handleMenuClick}
        />
      }
      <Menu
        defaultOpenKeys={[currentMenu?.key]}
        selectedKeys={[currentPage?.parent || currentPage?.key]}
        mode="inline"
        collapsed={collapsed.toString()}
        items={sidebarMenus.map((m) => ({
          key: m.key,
          label: m.label,
          children: m.children,
          icon: m.icon
        }))}
        onClick={handleMenuClick}
      />
    </div>
  );
}

export default SidebarCenter;
