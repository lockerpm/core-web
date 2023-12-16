import authServices from '../services/auth'
import global from '../config/global'
import common from '../utils/common'

export async function handleResponseErrorMessage(err) {
  if (err.response === undefined) {
    return err
  }
  if (err.response.status === 401) {
    authServices.logout();
    return
  }
  if ([403, 500, 502].includes(err.response.status)) {
    const isLocked = await global.jsCore?.vaultTimeoutService.isLocked()
    if (!isLocked) {
      const currentPage = common.getRouterByLocation(global.location)
      global.navigate(global.keys.ADMIN_ERROR, currentPage.params || {}, { code: err.response.status })
    }
  }
  return err
}
