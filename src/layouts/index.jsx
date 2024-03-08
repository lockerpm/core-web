import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useWebSocket from "react-use-websocket"
import { useLocation } from "react-router-dom"
import {
  Layout,
  Button
} from "@lockerpm/design"

import {
  CloseOutlined,
  VerticalAlignTopOutlined
} from "@ant-design/icons"

import layoutComponents from "../components/layout"
import layoutsComponents from "./components"

import authServices from "../services/auth"
import commonServices from "../services/common"
import enterpriseServices from "../services/enterprise"

import storeActions from "../store/actions"

import global from "../config/global"
import common from "../utils/common"

import "./css/index.scss"

function AdminLayout(props) {
  const { PageContent } = layoutComponents;
  const {
    Header,
    SidebarTop,
    SidebarCenter,
    SidebarBottom
  } = layoutsComponents;
  const { routers, pages } = props
  const dispatch = useDispatch()
  const location = useLocation()

  const isMobile = useSelector((state) => state.system.isMobile)
  const collapsed = useSelector((state) => state.system.collapsed)
  const currentPage = useSelector((state) => state.system.currentPage)
  const isScrollToTop = useSelector((state) => state.system.isScrollToTop)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const teams = useSelector((state) => state.enterprise.teams)

  const [respCollapsed, setRespCollapsed] = useState(true)

  const accessToken = authServices.access_token()
  const { lastMessage } = useWebSocket(`${global.endpoint.WS_SYNC}?token=${accessToken}`)

  useEffect(() => {
    if (lastMessage) {
      const strData = lastMessage?.data.split("'").join('"')
      const messageData = JSON.parse(strData)
      if (messageData.event === "sync") {
        commonServices.sync_data_by_ws(messageData)
      }
    }
  }, [lastMessage])

  const hideLayout = useMemo(() => {
    return !!currentPage.hideLayout
  }, [currentPage])

  useEffect(() => {
    dispatch(storeActions.updateIsScrollToTop(false))
  }, [location])

  useEffect(() => {
    if (currentPage?.params?.enterprise_id) {
      if (userInfo?.is_super_admin) {
        enterpriseServices.get(currentPage?.params?.enterprise_id).then((response) => {
          dispatch(storeActions.updateCurrentEnterprise(response))
        }).catch(() => {
          dispatch(storeActions.updateCurrentEnterprise(null))
        })
      } else if (teams[0]?.role?.includes('admin')) {
        dispatch(storeActions.updateCurrentEnterprise(teams[0]))
      } else {
        dispatch(storeActions.updateCurrentEnterprise(null))
      }
    } else {
      dispatch(storeActions.updateCurrentEnterprise(null))
    }
  }, [currentPage?.params?.enterprise_id, userInfo, teams])

  useEffect(() => {
    convertSize();
    setInterval(() => {
      checkVaultTimeOut()
    }, [5 * 1000])
  }, [])

  window.addEventListener("resize", (event) => {
    convertSize()
  })

  const checkVaultTimeOut = async () => {
    const isLocked = await global.jsCore?.vaultTimeoutService.isLocked();
    const timeoutAction = userInfo.timeout_action;
    if (isLocked && currentPage.type === 'admin') {
      if (timeoutAction === global.constants.TIMEOUT_ACTION.LOCK) {
        await authServices.redirect_login()
      } else {
        await authServices.logout()
      }
    }
  }

  const convertSize = () => {
    if (window.innerWidth <= 768) {
      dispatch(storeActions.updateIsMobile(true))
      dispatch(storeActions.updateCollapsed(false))
      setRespCollapsed(true)
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
      {hideLayout && (
        <Layout className='admin-no-layout'>
          <Layout.Content className='admin-no-layout__content'>
            <PageContent routers={routers} pages={pages} />
          </Layout.Content>
        </Layout>
      )}
      {!hideLayout && (
        <Layout className='admin-layout'>
          {!respCollapsed && (
            <Layout.Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className={respCollapsed ? "" : "resp-collapsed"}
            >
              <SidebarTop collapsed={collapsed} />
              <SidebarCenter
                collapsed={collapsed}
                routers={routers}
                onClose={() => isMobile ? setRespCollapsed(true) : () => {}}
              />
              <SidebarBottom collapsed={collapsed} />
              {isMobile && <div className="resp-collapsed-bg" onClick={() => setRespCollapsed(true)}>
                <div className='resp-menu-toggle-icon mr-3' onClick={() => setRespCollapsed(true)}>
                  <CloseOutlined />
                </div>
              </div>}
            </Layout.Sider>
          )}
          <Layout
            className={`admin-layout-center ${collapsed ? "admin-layout-center-collapsed" : ""} ${isMobile ? "mobile" : ""}`}
          >
            <Layout.Header style={{ padding: 0 }}>
              <Header
                className='admin-layout-header'
                collapsed={collapsed}
                setCollapsed={(v) => dispatch(storeActions.updateCollapsed(v))}
                setRespCollapsed={setRespCollapsed}
              />
            </Layout.Header>
            <Layout.Content className='admin-layout-content'>
              <PageContent routers={routers} pages={pages} />
            </Layout.Content>
          </Layout>
          {isScrollToTop && (
            <div className='admin-layout__button'>
              <Button
                type='primary'
                shape='circle'
                onClick={() => common.scrollToTop()}
                icon={<VerticalAlignTopOutlined />}
                size={"large"}
              />
            </div>
          )}
        </Layout>
      )}
    </>
  )
}

export default AdminLayout
