import React, { } from 'react'
import moment from 'moment'
import { IntlProvider } from 'react-intl'
import { ConfigProvider } from '@lockerpm/design'
import { connect } from 'react-redux'
import vi_VN from '@lockerpm/design/es/locale/vi_VN'
import en_US from '@lockerpm/design/es/locale/en_US'
import 'moment/locale/vi'
import vi from '../locale/vi.json'
import en from '../locale/en.json'
import global from '../config/global'

import keys from '../config/keys'
global.keys = keys

import constants from '../config/constants'
global.constants = constants

import patterns from '../config/patterns'
global.patterns = patterns

import rules from '../config/rules'
global.rules = rules

import endpoint from '../config/endpoint'
global.endpoint = endpoint

import urls from '../config/urls'
global.urls = urls

import routers from '../config/routers'
global.routers = routers

import menus from '../config/menus'
global.menus = menus

import store from '../store'
global.store = store

const Locales = props => {
  const localeIntl = {
    locale: props.locale,
    messages: props.locale === 'en' ? en : vi,
  }
  moment.locale(props.locale)
  
  return (
    <IntlProvider {...localeIntl}>
      <ConfigProvider
        locale={props.locale === 'en' ? en_US : vi_VN}
      >
        {props.children}
      </ConfigProvider>
    </IntlProvider>
  )
}

export default connect(
  state => ({
    locale: state.system.locale,
  }),
  null
)(Locales)
