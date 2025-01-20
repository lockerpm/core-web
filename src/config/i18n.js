/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locale/en.json'
import vi from '../locale/vi.json'
import zh from '../locale/zh.json'
import ru from '../locale/ru.json'

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
  zh: {
    translation: zh,
  },
  ru: {
    translation: ru,
  }
}

i18n.use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n