import global from '../../config/global'
import other from './other'

const allRouters = () => {
  return [
    ...global.routers.AUTH_ROUTERS.map(r => ({ ...r, type: 'auth' })),
    ...global.routers.ERROR_ROUTERS.map(r => ({ ...r, type: 'error' })),
    ...global.routers.PUBLIC_ROUTERS.map(r => ({ ...r, type: 'public' })),
    ...global.routers.ADMIN_ROUTERS.map(r => ({ ...r, type: 'admin' })),
  ].map(r => ({
    ...r,
    keys: r.path.split('/'),
  }))
}

const convertQueryToString = (routerPath, query) => {
  if (typeof query === 'object' && !other.isEmpty(query)) {
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
  const querys = queryString.slice(1, queryString.length)?.split('&').filter(Boolean)
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
  const route = allRouters().find(r => r.name === name)
  return route ? {
    ...route,
    key: route.name
  } : {}
}

const compareLocation = (routerKeys, location) => {
  const pathName = location.pathname || location?.toString()
  const locationKeys = pathName.split('/') || []
  const result = {
    params: {},
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
  const route = allRouters().find(r => compareLocation(r.keys, location).valid)
  return route ? {
    ...route,
    key: route.name,
    params: compareLocation(route.keys, location).params,
    hash: compareLocation(route.keys, location).hash,
    query: convertStringToQuery(location.search)
  } : null
}

const getRoutersByLocation = location => {
  const route = getRouterByLocation(location)
  let menu = global.menus.ADMIN_MENUS.find(m => {
    if (m.children) {
      return !!m.children.find(c => c.key === route?.name)
    }
    if (route.parent) {
      return m.key === route?.parent
    }
    return m.key === route?.name
  })
  let parent = null
  if (menu?.parent) {
    parent = global.menus.ADMIN_MENUS.find(m => m.key === menu.parent)
  }
  const menus = []
  if (parent) {
    menus.push(parent)
  }
  if (menu) {
    if (menu.key === route.name) {
      menus.push({ ...menu, ...route })
    } else {
      menus.push(menu)
    }
  }
  if (route.parent) {
    menus.push(route)
  }
  return menus
}

export default {
  allRouters,
  convertQueryToString,
  convertStringToQuery,
  getRouterParams,
  getRouterByName,
  compareLocation,
  getRouterByLocation,
  getRoutersByLocation
}