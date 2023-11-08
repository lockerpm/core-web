import authPages from './auth'
import adminPages from './admin'
import errorPages from './errors'
import publicPage from './public'

export default {
  ...publicPage,
  ...authPages,
  ...errorPages,
  ...adminPages,
}