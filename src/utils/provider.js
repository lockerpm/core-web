import React from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConfigProvider } from '@lockerpm/design'

import vi_VN from '@lockerpm/design/es/locale/vi_VN'
import en_US from '@lockerpm/design/es/locale/en_US'
import zh_CN from '@lockerpm/design/es/locale/zh_CN'
import ru_RU from "@lockerpm/design/es/locale/ru_RU";
import fr_FR from "@lockerpm/design/es/locale/fr_FR";

import moment from 'moment'
import 'moment/locale/vi'
import "moment/locale/ru";
import 'moment/locale/zh-cn'

import global from '../config/global'

const getLocale = (locale) => {
  if (locale === global.constants.LANGUAGE.EN) {
    return {
      value: en_US,
      default: en_US
    }
  }
  if (locale === global.constants.LANGUAGE.VI) {
    return {
      value: vi_VN,
      default: vi_VN
    }
  }
  if (locale === global.constants.LANGUAGE.ZH) {
    return {
      value: zh_CN,
      default: zh_CN
    }
  }
  if (locale === global.constants.LANGUAGE.RU) {
    return {
      value: ru_RU,
      default: ru_RU
    }
  }
  if (locale === global.constants.LANGUAGE.FR) {
    return {
      value: fr_FR,
      default: fr_FR
    }
  }
}

const Locales = props => {
  const localeIntl = {
    locale: props.locale,
    messages: getLocale(props.locale).value,
  }
  moment.locale(props.locale)
  
  return (
    <IntlProvider {...localeIntl}>
      <ConfigProvider
        locale={getLocale(props.locale).default}
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
