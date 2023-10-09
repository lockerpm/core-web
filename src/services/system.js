import Cookies from 'js-cookie'

function update_language(data) {
  Cookies.set('secrets-language', JSON.stringify(data))
}

function get_language() {
  try {
    const lang = JSON.parse(Cookies.get('secrets-language'))
    return ['en', 'vi'].includes(lang) ? lang : 'en'
  } catch (_) {
    return 'en'
  }
}

function update_cache(data) {
  Cookies.set('secrets-cache', JSON.stringify(data))
}

function get_cache() {
  try {
    return JSON.parse(Cookies.get('secrets-cache')) || {}
  } catch (_) {
    return {}
  }
}

export default {
  update_language,
  get_language,
  update_cache,
  get_cache,
}
