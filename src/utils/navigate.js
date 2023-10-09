import {
  convertQueryToString,
  convertStringToQuery,
  getRouterByName,
  getRouterParams,
} from './common'

import storeActions from '../store/actions'

export const navigatePage = async (navigate, dispatch, name, params = {}, query = {}) => {
  if (name === 'BACK') {
    return navigate(-1)
  }


  const currentRouter = getRouterByName(name)
  if (!currentRouter) {
    return navigate('/')
  }

  dispatch(storeActions.updateCurrentPage({
    ...currentRouter,
    key: name,
    params,
    query: convertStringToQuery(query)
  }))

  const newParams = { ...params }
  const newPath = convertQueryToString(getRouterParams(currentRouter.path, newParams), query)
  return navigate(newPath)
}