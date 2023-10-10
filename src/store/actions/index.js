import authActions from './auth'
import syncActions from './sync'
import systemActions from './system'
import cipherActions from './cipher'

export default {
  ...authActions,
  ...syncActions,
  ...systemActions,
  ...cipherActions
}