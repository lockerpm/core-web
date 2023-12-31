import React, { useEffect, useMemo } from 'react'
import { Layout, Modal, notification } from '@lockerpm/design'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  ExclamationCircleOutlined
} from '@ant-design/icons'

import './assets/css/index.scss'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-phone-number-input/style.css'

import { navigatePage } from './utils/navigate'
import { getRouterByLocation } from './utils/common'

import AdminLayout from './layouts/admin'
import AuthLayout from './layouts/auth'
import ErrorsLayout from './layouts/errors'

import userServices from './services/user'
import systemServices from './services/system'
import storeActions from './store/actions'
import authServices from './services/auth'

import i18n from './config/i18n'
import global from './config/global'
import jsCore from './core-js/index'

import pages from './pages'

const App = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const location = useLocation()

  notification.config({ placement: 'bottomLeft', duration: 3 })
  global.notification = (type, message, description) => { notification[type]({ message, description })}
  global.navigate = (name, params = {}, query = {}) => navigatePage(navigate, dispatch, name, params, query)
  global.pushSuccess = message => {
    global.notification(
      'success',
      t('notification.success.title'),
      message
    )
  }
  global.pushError = error => {
    const message = error?.response?.data?.message || error?.message
    global.notification(
      'error',
      t('notification.error.title'),
      message || t('notification.error.message.default')
    )
  }
  global.confirmDelete = (handleOK = () => {}) => Modal.confirm({
    title: t('common.confirm'),
    icon: <ExclamationCircleOutlined />,
    content: t('common.delete_question'),
    okText: t('button.delete'),
    cancelText: t('button.cancel'),
    okButtonProps: {
      danger: true
    },
    onOk: handleOK
  })

  const userInfo = useSelector(state => state.auth.userInfo)
  const currentPage = useSelector(state => state.system.currentPage)

  useEffect(() => {
    const locale = systemServices.get_language()
    dispatch(storeActions.changeLanguage(locale))
    i18n.changeLanguage(locale)
    authServices.redirect_login()
    initJsCore()
  }, [])

  useEffect(() => {
    const currentPage = getRouterByLocation(location)
    dispatch(storeActions.updateCurrentPage(currentPage))
  }, [location])

  useEffect(() => {
    beforeRedirect()
  }, [location])

  const initJsCore = async () => {
    if (!global.jsCore) {
      global.jsCore = await jsCore()
    }
  }

  const beforeRedirect = async () => {
    const currentPage = getRouterByLocation(location)
    const accessToken = authServices.access_token()
    if (accessToken) {
      if (!currentPage) {
        global.navigate('ADMIN_ERROR')
        return
      }
      if (!currentPage.not_auth) {
        return
      }
    } else {
      if (!currentPage) {
        global.navigate('404')
        return
      }
    }
  }

  return (
    <Layout>
      {
        currentPage?.type === 'admin' && userInfo && <AdminLayout
          routers={global.routers.ADMIN_ROUTERS}
          pages={pages}
        />
      }
      {
        currentPage?.type === 'auth' && <AuthLayout
          routers={global.routers.AUTH_ROUTERS}
          pages={pages}
        />
      }
      {
        currentPage?.type === 'error' && <ErrorsLayout
          routers={global.routers.ERROR_ROUTERS}
          pages={pages}
        />
      }
    </Layout>
  )
}

export default App
