import authPages from './auth'
import adminPages from './admin'
import dashboardPages from './dashboard'
import errorPages from './errors'
import publicPage from './public'

export default {
  ...publicPage,
  ...authPages,
  ...errorPages,
  ...adminPages,
  ...dashboardPages,
}