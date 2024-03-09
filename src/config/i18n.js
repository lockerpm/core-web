/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locale/en.json'
import vi from '../locale/vi.json'

import common from '../utils/common'

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
}

i18n.use(initReactI18next)
  .init({
    resources,
    lng: common.getLanguage(),
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n