import common from '.'

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
  const route = getRouterByLocation(location)
  if (route) {
    let menu = common.allMenus().find(m => {
      if (m.children) {
        return !!m.children.find(c => c.key === route?.name)
      }
      if (route.parent) {
        return m.key === route.parent
      }
      return m.key === route.name
    })
    let parent = null
    if (menu?.parent) {
      parent = common.allMenus().find(m => m.key === menu.parent)
    }
    const routers = []
    if (parent) {
      routers.push(parent)
    }
    if (menu) {
      if (menu.key === route.name) {
        routers.push({ ...menu, ...route })
      } else {
        routers.push(menu)
      }
      if (route.parent) {
        routers.push(route)
      }
    } else {
      routers.push(route)
    }
    return routers
  }
  return []
}
export default {
  convertQueryToString,
  convertStringToQuery,
  getRouterParams,
  getRouterByName,
  getRouterByLocation,
  getRoutersByLocation
}