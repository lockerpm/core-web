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
import enterpriseServices from "../services/enterprise"

import storeActions from "../store/actions"

import global from "../config/global"
import common from "../utils/common"

import "./css/index.scss"

function AdminLayout(props) {
  const { PageContent } = layoutComponents;
  const {
    Header,
    Footer,
    Other,
    SidebarTop,
    SidebarCenter,
    SidebarBottom
  } = layoutsComponents;
  const { routers, pages } = props
  const dispatch = useDispatch()
  const location = useLocation()

  const isMobile = useSelector((state) => state.system.isMobile)
  const collapsed = useSelector((state) => state.system.collapsed)
  const respCollapsed = useSelector((state) => state.system.respCollapsed)
  const currentPage = useSelector((state) => state.system.currentPage)
  const isScrollToTop = useSelector((state) => state.system.isScrollToTop)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const teams = useSelector((state) => state.enterprise.teams)

  const [showBottom, setShowBottom] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const { lastMessage } = useWebSocket(accessToken ? `${global.endpoint.WS_SYNC}?token=${accessToken}` : null, {
    shouldReconnect: () => true,
    reconnectInterval: 5000
  })

  useEffect(() => {
    common.getAccessToken().then((res) => {
      setAccessToken(res)
    })
  }, [])

  useEffect(() => {
    if (lastMessage) {
      const strData = lastMessage?.data.split("'").join('"')
      const messageData = JSON.parse(strData)
      if (messageData.event === "sync") {
        common.syncDataByWs(messageData)
      }
    }
  }, [lastMessage])

  useEffect(() => {
    dispatch(storeActions.updateIsScrollToTop(false))
    common.scrollToTop();
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
    if (global.jsCore?.vaultTimeoutService) {
      setInterval(async () => {
        const isLocked = await global.jsCore?.vaultTimeoutService.isLocked();
        setIsLocked(isLocked)
      }, [5 * 1000])
    }
  }, [global.jsCore])

  useEffect(() => {
    checkVaultTimeOut();
  }, [isLocked, currentPage, userInfo])

  const hideLayout = useMemo(() => {
    return !!currentPage.hideLayout
  }, [currentPage])

  window.addEventListener("resize", (event) => {
    convertSize()
  })

  const checkVaultTimeOut = async () => {
    const timeoutAction = userInfo?.timeout_action;
    if (isLocked) {
      if (timeoutAction == global.constants.TIMEOUT_ACTION.LOCK) {
        await authServices.redirect_login()
      } else {
        await authServices.logout(true)
      }
    }
  }

  const setRespCollapsed = (value) => {
    dispatch(storeActions.updateRespCollapsed(value))
  }

  const setCollapsed = (value) => {
    dispatch(storeActions.updateCollapsed(value))
  }

  const setIsMobile = (value) => {
    dispatch(storeActions.updateIsMobile(value))
  }


  const convertSize = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(false)
      setRespCollapsed(true)
      setIsMobile(true)
    } else if (window.innerWidth <= 1024) {
      setRespCollapsed(false)
      if (!collapsed) {
        setCollapsed(true)
      }
      setIsMobile(false)
    } else {
      setRespCollapsed(false)
      setCollapsed(false)
      setIsMobile(false)
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
                showBottom={showBottom}
                onClose={() => isMobile ? setRespCollapsed(true) : () => {}}
              />
              <SidebarBottom
                collapsed={collapsed}
                showBottom={showBottom}
                setShowBottom={setShowBottom}
              />
              {
                isMobile && <div
                  className="resp-collapsed-bg"
                  onClick={() => setRespCollapsed(true)}
                >
                  <div
                    className='resp-menu-toggle-icon mr-3'
                    onClick={() => setRespCollapsed(true)}
                  >
                    <CloseOutlined />
                  </div>
                </div>
              }
            </Layout.Sider>
          )}
          <Layout
            className={`admin-layout-center ${collapsed ? "admin-layout-center-collapsed" : ""} ${isMobile ? "mobile" : ""}`}
          >
            <Layout.Header style={{ padding: 0 }}>
              <Header
                className='admin-layout-header'
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setRespCollapsed={setRespCollapsed}
              />
            </Layout.Header>
            <Layout.Content
              className={`admin-layout-content  ${showFooter ? 'is-footer' : ''}`}
            >
              <PageContent routers={routers} pages={pages} />
            </Layout.Content>
            <Layout.Footer style={{ padding: 0 }}>
              <Footer
                className='admin-layout-footer'
                showFooter={showFooter}
                setShowFooter={setShowFooter}
              />
            </Layout.Footer>
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
          <Other />
        </Layout>
      )}
    </>
  )
}

export default AdminLayout
