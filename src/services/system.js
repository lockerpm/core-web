import global from '../config/global';

function update_language(data) {
  localStorage.setItem('secrets-language', JSON.stringify(data))
}

function get_language() {
  try {
    const lang = JSON.parse(localStorage.getItem('secrets-language'))
    return [
      global.constants.LANGUAGE.EN,
      global.constants.LANGUAGE.VI
    ].includes(lang) ? lang : global.constants.LANGUAGE.EN
  } catch (_) {
    return global.constants.LANGUAGE.EN
  }
}

function update_cache(data) {
  localStorage.setItem('secrets-cache', JSON.stringify(data))
}

function get_cache() {
  try {
    return JSON.parse(localStorage.getItem('secrets-cache')) || {}
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
