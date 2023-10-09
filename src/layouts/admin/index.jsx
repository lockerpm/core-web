import React, { useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Button
} from '@lockerpm/design';

import {
  CloseOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons';

import './css/index.scss';

import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { } from 'react-use-websocket';
import { useLocation } from 'react-router-dom'

import Header from './Header';
import SidebarTop from './components/SidebarTop';
import SidebarCenter from './components/SidebarCenter';

import PageContent from '../../routes';

import storeActions from "../../store/actions";

import authServices from '../../services/auth';
import coreServices from '../../services/core';

import global from '../../config/global';
import { CipherType } from "../../core-js/src/enums";
import { CipherData } from '../../core-js/src/models/data/cipherData'

import { scrollToTop } from '../../utils/common';

function AdminLayout(props) {
  const {
    routers,
    pages,
  } = props
  const dispatch = useDispatch();
  const location = useLocation()
  const isMobile = useSelector((state) => state.system.isMobile);
  const collapsed = useSelector((state) => state.system.collapsed);
  const currentPage = useSelector((state) => state.system.currentPage);
  const isScrollToTop = useSelector((state) => state.system.isScrollToTop);
  const isSync = useSelector((state) => state.core.isSync);
  const isFetchProjects = useSelector((state) => state.project.isFetchProjects);

  const [respCollapsed, setRespCollapsed] = useState(false);

  const accessToken = authServices.access_token()
  const { lastMessage } = useWebSocket(`${process.env.REACT_APP_WS_URL}?token=${accessToken}`);

  useEffect(() => {
    if (lastMessage) {
      const strData = lastMessage?.data.split("'").join('"')
      const messageData = JSON.parse(strData)
      if (messageData.event === 'sync') {
        handleSyncWsData(messageData)
      }
    }
  }, [lastMessage]);

  const hideLayout = useMemo(() => {
    return !!currentPage.hideLayout
  }, [currentPage])

  useEffect(() => {
    dispatch(storeActions.updateIsScrollToTop(false));
    convertSize()
  }, [location])

  useEffect(() => {
    if (isFetchProjects) {
      fetchProjects()
    }
  }, [isFetchProjects])

  window.addEventListener("resize", (event) => {
    convertSize()
  });

  const fetchProjects = async () => {
    await projectServices.list({ paging: 0 }).then((response) => {
      dispatch(storeActions.updateProjects(response))
      if (currentPage.params?.project_id) {
        dispatch(storeActions.updateSelectedProject(response.find((p) => p.id == currentPage.params?.project_id)))
      }
    }).catch(() => {
      dispatch(storeActions.updateProjects([]))
      dispatch(storeActions.updateSelectedProject(null))
    })
    dispatch(storeActions.updateIsFetchProjects(false));
  }

  const handleSyncWsData = async (messageData) => {
    dispatch(storeActions.updateSyncing(true))
    if (messageData?.data?.id) {
      if (messageData.type.includes('delete')) {
        await global.jsCore.cipherService.delete(messageData.data.id)
      } else if (messageData.data.project_id) {
        const userId = await global.jsCore.userService.getUserId()
        if (messageData.type.includes('secret')) {
          const data = await secretServices.get(messageData.data.project_id, messageData.data.id)
          const secretData = coreServices.convert_origin_item_to_cipher({ ...data, type: CipherType.Secret })
          await global.jsCore.cipherService.upsert(new CipherData(secretData, userId))
        } else if (messageData.type.includes('env')) {
          const data = await environmentServices.get(messageData.data.project_id, messageData.data.id)
          const secretData = coreServices.convert_origin_item_to_cipher({ ...data, type: CipherType.Environment })
          await global.jsCore.cipherService.upsert(new CipherData(secretData, userId))
        }
      }
    }
    dispatch(storeActions.updateSyncing(false));
  }

  const convertSize = () => {
    if (window.innerWidth <= 768) {
      dispatch(storeActions.updateIsMobile(true))
      dispatch(storeActions.updateCollapsed(false))
    } else if (window.innerWidth <= 1024) {
      dispatch(storeActions.updateIsMobile(false))
      setRespCollapsed(false)
      if (!collapsed) {
        dispatch(storeActions.updateCollapsed(true))
      }
    } else if (window.innerWidth <= 1248) {
      setRespCollapsed(false)
      dispatch(storeActions.updateIsColumn(false))
      dispatch(storeActions.updateIsMobile(false))
      dispatch(storeActions.updateCollapsed(false))
    } else {
      setRespCollapsed(false)
      dispatch(storeActions.updateIsColumn(false))
      dispatch(storeActions.updateIsMobile(false))
      dispatch(storeActions.updateCollapsed(false))
    }
  }

  return (
    <>
      {
        hideLayout && <Layout className="admin-no-layout">
          <Layout.Content className="admin-no-layout__content">
            <PageContent routers={routers} pages={pages}/>
          </Layout.Content>
        </Layout>
      }
      {
        !hideLayout && <Layout className='admin-layout'>
          {
            !respCollapsed && <Layout.Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className={respCollapsed ? '' : 'resp-collapsed'}
            >
              
              <SidebarTop
                collapsed={collapsed}
              />
              <SidebarCenter
                collapsed={collapsed}
                routers={routers}
              />
              {
                isMobile && <div className='resp-menu-toggle-icon mr-3' onClick={() => setRespCollapsed(true)}>
                  <CloseOutlined />
                </div>
              }
            </Layout.Sider>
          }
          <Layout
            className={`admin-layout-center ${ collapsed ? 'admin-layout-center-collapsed' : '' } ${ isMobile ? 'mobile' : '' }`}
          >
            <Layout.Header style={{ padding: 0 }}>
              <Header
                className="admin-layout-header"
                collapsed={collapsed}
                setCollapsed={(v) => dispatch(storeActions.updateCollapsed(v))}
                setRespCollapsed={setRespCollapsed}
              />
            </Layout.Header>
            <Layout.Content
              className='admin-layout-content'
            >
              <PageContent
                routers={routers}
                pages={pages}
              />
            </Layout.Content>
          </Layout>
          {
            isScrollToTop && <div className='admin-layout__button'>
              <Button
                type="primary"
                shape="circle"
                onClick={() => scrollToTop()}
                icon={<VerticalAlignTopOutlined />} size={'large'}
              />
            </div>
          }
        </Layout>
      }
    </>
  );
}

export default AdminLayout;
