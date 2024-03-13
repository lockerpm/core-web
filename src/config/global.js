import keys from '../config/keys'
import constants from '../config/constants'
import patterns from '../config/patterns'
import rules from '../config/rules'
import endpoint from '../config/endpoint'
import urls from '../config/urls'
import routers from '../config/routers'
import menus from '../config/menus'
import store from '../store'

global.store = store
export default {
  endpoint,
  constants,
  routers,
  menus,
  patterns,
  rules,
  store,
  keys,
  urls,
  jsCore: null,
  location: {},
  confirm: () => {},
  notification: () => {},
  navigate: () => {},
  pushSuccess: () => {},
  pushError: () => {},
}