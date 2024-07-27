import storeActions from '../store/actions'
import global from '../config/global'
import common from './common'

export const navigatePage = async (
  navigate,
  dispatch,
  name,
  params = {},
  query = {},
  replace = false
) => {
  if (name === global.keys.BACK) {
    return navigate(-1, { replace })
  }

  const currentRouter = common.getRouterByName(name)
  if (!currentRouter) {
    return navigate('/', { replace })
  }

  dispatch(storeActions.updateCurrentPage({
    ...currentRouter,
    key: name,
    params,
    query: common.convertStringToQuery(query)
  }))

  const newParams = { ...params }
  const newPath = common.convertQueryToString(
    common.getRouterParams(currentRouter.path, newParams),
    query
  )
  return navigate(newPath, { replace })
}