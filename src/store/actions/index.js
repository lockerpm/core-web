import authActions from './auth'
import syncActions from './sync'
import systemActions from './system'

export default {
  ...authActions,
  ...syncActions,
  ...systemActions,
}