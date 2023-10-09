import authActions from './auth'
import coreActions from './core'
import systemActions from './system'

export default {
  ...authActions,
  ...coreActions,
  ...systemActions,
}