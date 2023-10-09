import React, { useEffect, useState, useMemo } from 'react';

import { Breadcrumb } from '@lockerpm/design';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getRoutersByLocation } from "../../utils/common";
import { RouterLink } from "../../components";

import './css/Breadcrumb.scss';

function LayoutBreadcrumb() {
  const location = useLocation();

  const [menus, setMenus] = useState([])
  const selectedWorkspace = useSelector((state) => state.workspace.selectedWorkspace);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const currentPage = useSelector((state) => state.system.currentPage);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (location) {
      const brRouters = getRoutersByLocation(location);
      const lastRouter = brRouters.slice(-1)[0];
      if (lastRouter && lastRouter.parent === 'PROJECTS' && selectedProject?.id == currentPage?.params?.project_id) {
        let lastMenus = [lastRouter]
        if (lastRouter.children) {
          lastMenus = [
            {
              ...lastRouter.children[0],
              label: lastRouter.label
            },
            {
              ...lastRouter.children.find((m) => m.key === currentPage.name)
            }
          ]
        }
        setMenus([
          ...brRouters.filter((m) => m.key !== lastRouter.key),
          {
            key: 'PROJECT_SECRETS',
            label: selectedProject?.name
          },
          ...lastMenus
        ]);
      } else {
        setMenus(brRouters);
      }
    }
  }, [location, selectedProject, currentPage])

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
    if (selectedWorkspace && currentPage.params.workspace_id) {
      return [
        {
          key: 'workspace',
          title: <span>
            {selectedWorkspace.name}
          </span>
        },
        ...breadcrumbRouters
      ]
    }
    return breadcrumbRouters
  }, [menus, selectedWorkspace, currentPage, userInfo])

  return (
    <Breadcrumb className='flex items-center' items={items}>
    </Breadcrumb>
  )
}

export default LayoutBreadcrumb;