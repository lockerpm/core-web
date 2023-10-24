import authActions from './auth'
import syncActions from './sync'
import systemActions from './system'
import cipherActions from './cipher'
import folderActions from './folder'
import collectionActions from './collection'
import organizationActions from './organization'
import shareActions from './share'
import enterpriseActions from './enterprise'

export default {
  ...authActions,
  ...syncActions,
  ...systemActions,
  ...cipherActions,
  ...folderActions,
  ...collectionActions,
  ...organizationActions,
  ...shareActions,
  ...enterpriseActions
}