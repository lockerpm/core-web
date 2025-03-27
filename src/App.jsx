import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Layout, Modal, notification } from '@lockerpm/design'

import commonComponents from './components/common'

import {
  ExclamationCircleOutlined
} from '@ant-design/icons'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './assets/css/index.scss'

import { navigatePage } from './utils/navigate'
import common from './utils/common'

import AdminLayout from './layouts'
import OtherLayout from './layouts/other'

import storeActions from './store/actions'
import commonServices from './services/common'

import global from './config/global'
import jsCore from './core-js/index'

import pages from './pages'
import { service } from './service'

const App = () => {
  window.service = service;
  const jsCoreGlobal = { lockerContainerService: null };
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const location = useLocation()
  
  const { ClientService } = commonComponents

  global.location = location;
  notification.config({ placement: 'bottomLeft', duration: 3 })
  global.notification = (type, message, description) => { notification[type]({ message, description }) }
  global.navigate = (name, params = {}, query = {}) => navigatePage(navigate, dispatch, name, params, query)
  global.pushSuccess = message => {
    global.notification(
      'success',
      t('notification.success.title'),
      message
    )
  }
  global.pushError = error => {
    const message = common.getErrorMessage(error)
    global.notification(
      'error',
      t('notification.error.title'),
      message || t('notification.error.message.default')
    )
  }
  global.confirm = (handleOK = () => { }, options = {}) => Modal.confirm({
    title: options.title || t('common.confirm'),
    icon: <ExclamationCircleOutlined />,
    content: options.content || t('common.delete_question'),
    okText: options.okText || t('button.delete'),
    cancelText: t('button.cancel'),
    okButtonProps: options.okButtonProps || { danger: true },
    onOk: handleOK
  })

  const userInfo = useSelector(state => state.auth.userInfo)
  const currentPage = useSelector(state => state.system.currentPage)

  useEffect(() => {
    commonServices.init_server();
    const locale = common.getLanguage()
    common.updateLocale(locale)
    initJsCore()
  }, [])

  useEffect(() => {
    global.location = location;
    const currentPage = common.getRouterByLocation(location)
    dispatch(storeActions.updateCurrentPage(currentPage))
  }, [location])

  useEffect(() => {
    beforeRedirect()
  }, [location])

  const initJsCore = async () => {
    if (!global.jsCore) {
      global.jsCore = await jsCore(jsCoreGlobal)
    }
  }

  const beforeRedirect = async () => {
    const currentPage = common.getRouterByLocation(location)
    const accessToken = common.getAccessToken()
    if (accessToken) {
      if (!currentPage) {
        global.navigate(global.keys.ADMIN_ERROR)
        return
      }
      if (!currentPage.not_auth) {
        return
      }
    } else {
      if (!currentPage) {
        global.navigate(global.keys.ERROR_404)
        return
      }
    }
  }

  return (
    <Layout className='main-layout'>
      <ClientService />
      {
        currentPage?.type === 'admin' && userInfo && <AdminLayout
          routers={global.routers.ADMIN_ROUTERS}
          pages={pages}
        />
      }
      {
        currentPage?.type === 'auth' && <OtherLayout
          routers={global.routers.AUTH_ROUTERS}
          pages={pages}
        />
      }
      {
        currentPage?.type === 'error' && <OtherLayout
          routers={global.routers.ERROR_ROUTERS}
          pages={pages}
        />
      }
      {
        currentPage?.type === 'public' && <OtherLayout
          routers={global.routers.PUBLIC_ROUTERS}
          pages={pages}
        />
      }
    </Layout>
  )
}

export default App
