import common from '.'
import global from '../../config/global'

const convertQueryToString = (routerPath, query) => {
  if (typeof query === 'object' && !common.isEmpty(query)) {
    const querys = []
    Object.keys(query).forEach(key => {
      querys.push(`${key}=${query[key]}`)
    })
    return `${routerPath}?${querys.join('&')}`
  }
  if (typeof query === 'string') {
    return `${routerPath}${query}`
  }
  return routerPath
}

const convertStringToQuery = (queryString = {}) => {
  if (typeof queryString === 'object') {
    return queryString
  }
  const querys = queryString?.slice(1, queryString.length)?.split('&').filter(Boolean)
  const query = {}
  querys.forEach(q => {
    const key = q?.split('=')[0]
    const value = q?.split(key + '=')[1]
    query[key] = value
  })
  return query
}

const getRouterParams = (routerPath, params) => {
  let path = routerPath || ''
  const keys = routerPath?.split('/:').map(p => p.split('/')[0]).filter(Boolean) || []
  keys.forEach(key => {
    path = path.replace(`:${key}`, params[key])
  })
  return path
}

const getRouterByName = name => {
  const route = common.allRouters().find(r => r.name === name)
  return route ? {
    ...route,
    key: route.name
  } : {}
}

const compareLocation = (routerKeys, location) => {
  let pathName = location.pathname || location?.toString();
  const locationKeys = pathName.split('/') || []
  const result = {
    params: {},
    query: convertStringToQuery(location.search),
    hash: location.hash || null,
    valid: true
  }
  if (locationKeys.length !== routerKeys.length) {
    result.valid = false
  } else {
    routerKeys.forEach((k, index) => {
      if (k.includes(':')) {
        result.params = {
          ...result.params,
          [k.replace(':', '')]: locationKeys[index]
        }
      } else if (locationKeys[index] !== k) {
        result.valid = false
      }
    })
  }
  return result
}

const getRouterByLocation = location => {
  const route = common.allRouters().find(r => compareLocation(r.keys, location).valid)
  return route ? {
    ...route,
    key: route.name,
    params: compareLocation(route.keys, location).params,
    hash: compareLocation(route.keys, location).hash,
    query: compareLocation(route.keys, location).query
  } : null
}

const getRoutersByLocation = location => {
  const allRouters = common.allRouters();
  const allMenus = common.allMenus();

  const getParents = (router) => {
    const pRouter = allRouters.find((r) => r.name === router.parent)
    if (pRouter) {
      return [...getParents(pRouter), router]
    }
    return [router]
  }
  const router = getRouterByLocation(location)
  if (router) {
    const routers = getParents(router)
    const menu = allMenus.find((m) => m.key === routers[0].name);
    if (menu) {
      const menuParent = allMenus.find((m) => m.key === menu.parent)
      if (menuParent) {
        return [menuParent, menu, ...routers.slice(1, routers.length)]
      }
      return [menu, ...routers.slice(1, routers.length)]
    }
    return routers
  }
  return []
}

const getCipherRouterName = (currentPage, cipherType) => {
  if (currentPage?.name === global.keys.FOLDER_DETAIL) {
    return global.keys.FOLDER_DETAIL_ITEM
  }
  if (currentPage?.name === global.keys.SHARED_WITH_ME) {
    return global.keys.SHARED_WITH_ME_ITEM
  }
  if (currentPage?.name === global.keys.SHARED_WITH_ME_FOLDER) {
    return global.keys.SHARED_WITH_ME_FOLDER_ITEM
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS_FOLDER) {
    return global.keys.MY_SHARED_ITEMS_FOLDER_ITEM
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS) {
    if (currentPage?.query?.menu_type === global.constants.MENU_TYPES.QUICK_SHARES) {
      return global.keys.QUICK_SHARE_DETAIL
    }
    return global.keys.MY_SHARED_ITEMS_ITEM
  }
  if (currentPage?.name === global.keys.PASSWORD_HEALTH) {
    if (currentPage?.query?.active_key === 'reused_passwords') {
      return global.keys.PASSWORD_HEALTH_REUSED_ITEM
    }
    if (currentPage?.query?.active_key === 'exposed_passwords') {
      return global.keys.PASSWORD_HEALTH_EXPOSED_ITEM
    }
    return global.keys.PASSWORD_HEALTH_WEAK_ITEM
  }
  return cipherType?.detailRouter || global.keys.VAULT_DETAIL
}

const getCipherRouterParams = (currentPage, cipherId, sendId) => {
  if ([
    global.keys.FOLDER_DETAIL,
    global.keys.SHARED_WITH_ME_FOLDER,
    global.keys.MY_SHARED_ITEMS_FOLDER
  ].includes(currentPage?.name)) {
    return { 
      cipher_id: cipherId,
      folder_id: currentPage.params?.folder_id
    }
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS && currentPage?.query?.menu_type === global.constants.MENU_TYPES.QUICK_SHARES) {
    return {
      send_id: sendId
    }
  }
  return { 
    cipher_id: cipherId,
  }
}

const getCipherHistoryRouterName = (currentPage, cipherType) => {
  if (currentPage?.name === global.keys.FOLDER_DETAIL) {
    return global.keys.FOLDER_DETAIL_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.FOLDER_DETAIL_ITEM) {
    return global.keys.FOLDER_DETAIL_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.SHARED_WITH_ME_ITEM) {
    return global.keys.SHARED_WITH_ME_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.SHARED_WITH_ME_FOLDER) {
    return global.keys.SHARED_WITH_ME_FOLDER_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.SHARED_WITH_ME_FOLDER_ITEM) {
    return global.keys.SHARED_WITH_ME_FOLDER_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS_ITEM) {
    return global.keys.MY_SHARED_ITEMS_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS_FOLDER) {
    return global.keys.MY_SHARED_ITEMS_FOLDER_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.MY_SHARED_ITEMS_FOLDER_ITEM) {
    return global.keys.MY_SHARED_ITEMS_FOLDER_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.PASSWORD_HEALTH_WEAK_ITEM) {
    return global.keys.PASSWORD_HEALTH_WEAK_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.PASSWORD_HEALTH_REUSED_ITEM) {
    return global.keys.PASSWORD_HEALTH_REUSED_ITEM_HISTORY
  }
  if (currentPage?.name === global.keys.PASSWORD_HEALTH_EXPOSED_ITEM) {
    return global.keys.PASSWORD_HEALTH_EXPOSED_ITEM_HISTORY
  }
  return cipherType?.historyRouter || global.keys.VAULT_HISTORY
}

const getCipherHistoryRouterParams = (currentPage, cipherId) => {
  if ([
    global.keys.FOLDER_DETAIL,
    global.keys.FOLDER_DETAIL_ITEM,
    global.keys.SHARED_WITH_ME_FOLDER,
    global.keys.SHARED_WITH_ME_FOLDER_ITEM,
    global.keys.MY_SHARED_ITEMS_FOLDER,
    global.keys.MY_SHARED_ITEMS_FOLDER_ITEM
  ].includes(currentPage?.name)) {
    return { 
      cipher_id: cipherId,
      folder_id: currentPage.params?.folder_id
    }
  }
  return { 
    cipher_id: cipherId,
  }
}

const getFolderRouterName = (currentPage) => {
  if (currentPage?.name == global.keys.SHARED_WITH_ME) {
    return global.keys.SHARED_WITH_ME_FOLDER
  }
  if (currentPage?.name == global.keys.MY_SHARED_ITEMS) {
    return global.keys.MY_SHARED_ITEMS_FOLDER
  }
  return global.keys.FOLDER_DETAIL
}

const getFolderRouterNameParams = (folderId) => {
  return { folder_id: folderId }
}

export default {
  convertQueryToString,
  convertStringToQuery,
  getRouterParams,
  getRouterByName,
  getRouterByLocation,
  getRoutersByLocation,
  getCipherRouterName,
  getCipherRouterParams,
  getCipherHistoryRouterName,
  getCipherHistoryRouterParams,
  getFolderRouterName,
  getFolderRouterNameParams
}