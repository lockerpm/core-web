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
import syncServices from '../../services/sync';
import commonServices from '../../services/common';

import global from '../../config/global';

import common from '../../utils/common';

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

  const [respCollapsed, setRespCollapsed] = useState(false);

  const accessToken = authServices.access_token()
  const { lastMessage } = useWebSocket(`${global.endpoint.WS_SYNC}?token=${accessToken}`);

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

  window.addEventListener("resize", (event) => {
    convertSize()
  });

  const handleSyncWsData = async (message) => {
    console.log(message);
    dispatch(storeActions.updateSyncing(true))
    if (message.type.includes('cipher')) {
      if (['cipher_share', 'cipher_update', 'cipher_delete', 'cipher_restore'].includes(message.type)) {
        if (message.type === 'cipher_share') {
          await Promise.all([
            commonServices.sync_profile(),
            commonServices.sync_collections(),
          ])
        }
        if (message.data.id) {
          await commonServices.sync_items([message.data.id])
        }
        if (message.data.ids) {
          await commonServices.sync_items(message.data.ids)
        }
      } else if (message.type.includes('cipher_delete_permanent')) {
        await global.jsCore.cipherService.delete(message.data.ids)
      }
      await commonServices.get_all_ciphers();
    } else if (message.type.includes('folder')) {
      if (message.type.includes('update')) {
        const res = await syncServices.sync_folder(message.data.id);
        await global.jsCore.folderService.upsert([res])
      } else if (message.type.includes('delete')) {
        await global.jsCore.folderService.delete(message.data.ids)
      }
      await commonServices.get_all_folders();
    } else if (message.type.includes('collection')) {
      if (message.type.includes('update')) {
        const res = await syncServices.sync_collection(message.data.id);
        await global.jsCore.collectionService.upsert([res])
      } else if (message.type.includes('delete')) {
        await global.jsCore.collectionService.delete(message.data.ids)
      }
      await commonServices.get_all_collections();
    }
    dispatch(storeActions.updateSyncing(false))
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
                onClick={() => common.scrollToTop()}
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
