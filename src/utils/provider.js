import React, { } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { ConfigProvider } from '@lockerpm/design'

import vi_VN from '@lockerpm/design/es/locale/vi_VN'
import en_US from '@lockerpm/design/es/locale/en_US'
import zh_CN from '@lockerpm/design/es/locale/zh_CN'
import ru_RU from "@lockerpm/design/es/locale/ru_RU";

import moment from 'moment'
import 'moment/locale/vi'
import "moment/locale/ru";
import 'moment/locale/zh-cn'

import vi from '../locale/vi.json'
import en from '../locale/en.json'
import zh from '../locale/zh.json'
import ru from '../locale/ru.json'

import global from '../config/global'

const getLocale = (locale) => {
  if (locale === global.constants.LANGUAGE.EN) {
    return {
      value: en,
      default: en_US
    }
  }
  if (locale === global.constants.LANGUAGE.VI) {
    return {
      value: vi,
      default: vi_VN
    }
  }
  if (locale === global.constants.LANGUAGE.ZH) {
    return {
      value: zh,
      default: zh_CN
    }
  }
  if (locale === global.constants.LANGUAGE.RU) {
    return {
      value: ru,
      default: ru_RU
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
