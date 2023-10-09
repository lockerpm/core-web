
import moment from 'moment'
import dayjs from 'dayjs'
import global from '../config/global'
import store from '../store'
import storeActions from '../store/actions/index'
import { Trans } from 'react-i18next'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const has = Object.prototype.hasOwnProperty

export const allRouters = () => {
  return [
    ...global.routers.AUTH_ROUTERS.map(r => ({ ...r, type: 'auth' })),
    ...global.routers.ERROR_ROUTERS.map(r => ({ ...r, type: 'error' })),
    ...global.routers.ADMIN_ROUTERS.map(r => ({ ...r, type: 'admin' })),
  ].map(r => ({
    ...r,
    keys: r.path.split('/'),
  }))
}

export const isDiff = (A, B) => JSON.stringify(A) !== JSON.stringify(B)

export const isEmpty = prop => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  )
}

export const formatCurrency = (value = 0, fixed = 0, currency = '') => {
  let newValue = value || 0
  if (fixed && `${value || 0}`.split('.')[1]?.length > fixed) {
    newValue = Number(value || 0).toFixed(fixed)
  }
  return `${newValue} ${currency}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const separatorNumber = (value = 0) => {
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0
}

export const convertCurrency = (value = 0, fixed = 0) => {
  if (value >= 1000000000) {
    return `${separatorNumber((value / 1000000000).toFixed(fixed))} T`
  }
  if (value >= 1000000) {
    return `${separatorNumber((value / 1000000).toFixed(fixed))} Tr`
  }
  if (value > 1000) {
    return `${separatorNumber((value / 1000).toFixed(fixed))} K`
  }
  return separatorNumber(value.toFixed(fixed))
}

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export const convertQueryToString = (routerPath, query) => {
  if (typeof query === 'object' && !isEmpty(query)) {
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

export const convertStringToQuery = (queryString = {}) => {
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

export const convertTime = time => {
  const hours = Math.floor(Number(time) / 60)
  const minutes = Number(time) % 60
  return `${hours}h${minutes}m`
}

export const timeFromNow = time => {
  return dayjs(time * 1000).fromNow()
}

export const convertDateTime = (date, format = 'HH:mm DD-MM-YYYY') => {
  if (date) {
    return moment(date * 1000).format(format)
  }
  return ''
}

export const disabledDate = current => {
  return current && moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
}

export const disabledTime = (now, condition = true, type = 'hour') => {
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }
  if (condition) {
    return {
      disabledHours: () => type === 'hour' ? range(0, 23).filter(h => h <= moment(now).hour()) : [],
      disabledMinutes: () => type === 'minute' ? range(0, 59).filter(h => h <= moment(now).minute) : [],
      disabledSeconds: () => type === 'second' ? range(0, 59).filter(h => h <= moment(now).second) : [],
    }
  }
  return {
    disabledHours: () => []
  }
}

export const getCurrentWeekday = date => {
  return (moment(date).weekday() + 2) > 7 ? 1 : (moment(date).weekday() + 2)
}

export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const convertDateNow = () => {
  const now = moment()
  const mOptions = [0, 15, 30, 45]
  const h = now.hours()
  const m = now.minutes()
  const lastM = mOptions.find(o => o > m)
  if (lastM) {
    return moment(moment().format(`YYYY/MM/DD ${h}:${lastM}:ss`))
  } else {
    return moment(moment().add(1, 'hours').format('YYYY/MM/DD HH:00:ss'))
  }
}

export const getRouterParams = (routerPath, params) => {
  let path = routerPath || ''
  const keys = routerPath.split('/:').map(p => p.split('/')[0]).filter(Boolean)
  keys.forEach(key => {
    path = path.replace(`:${key}`, params[key])
  })
  return path
}

export const getRouterByName = name => {
  const route = allRouters().find(r => r.name === name)
  return route ? {
    ...route,
    key: route.name
  } : {}
}

export const compareLocation = (routerKeys, location) => {
  const pathName = location.pathname || location?.toString()
  const locationKeys = pathName.split('/') || []
  const result = {
    params: {},
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

export const getRouterByLocation = location => {
  const route = allRouters().find(r => compareLocation(r.keys, location).valid)
  return route ? {
    ...route,
    key: route.name,
    params: compareLocation(route.keys, location).params,
    query: convertStringToQuery(location.search)
  } : null
}

export const getRoutersByLocation = location => {
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
    menus.push(menu)
  }
  if (route.parent) {
    menus.push(route)
  }
  return menus
}

export const scrollToTop = () => {
  const layoutContent = document.querySelector('.layout-content')
  if (layoutContent) {
    layoutContent.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}

export const getTimeByOption = (key, value = []) => {
  let dates = value
  if (key === 'last_week') {
    dates = [dayjs().add(-7, 'days'), dayjs()]
  } else if (key === 'last_month') {
    dates = [dayjs().add(-1, 'month'), dayjs()]
  }
  return dates
}

export const paginationAndSortData = (allData, params, sortBy = 'creation_date', sortType = 'descend', filters = []) => {
  let filteredData = allData
  filters.forEach(f => {
    filteredData = filteredData.filter(d => f(d))
  })
  filteredData = filteredData.sort((d1, d2) => {
    let a = d1[sortBy], b = d2[sortBy]
    if (!a) {
      return 0
    }
    if (new Date(a) instanceof Date) {
      a = dayjs(new Date(a)).unix()
      b = dayjs(new Date(b)).unix()
    }
    if (sortType === 'ascend') {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    }
    if (a < b) {
      return 1
    }
    if (a > b) {
      return -1
    }
    return 0
  })

  return {
    total: filteredData.length,
    result: filteredData.slice((params.page - 1) * params.size, params.page * params.size)
  }
}

export const getColorByIndex = index => {
  const colors = require('@ant-design/colors')
  const newColors = []
  Object.keys(colors).forEach(k => {
    if (Array.isArray(colors[k])) {
      newColors.push(colors[k])
    }
  })
  const colorTotal = newColors.length * newColors[0].length
  let i = index
  if (index >= colorTotal ) {
    i = index - colorTotal
  }
  const key1 = i % newColors.length
  const key2 = Math.floor((i + 1) / newColors.length)
  return newColors[key1][key2]
}

export const getProject = (id, projects = []) => {
  return projects.find(e => e.id == id)
}

export function scrollEnd(event, params, total, setParams, isMobile = false, pageSize = global.constants.PAGE_SIZE) {
  if (event.target.scrollTop > 100) {
    store.dispatch(storeActions.updateIsScrollToTop(true))
  } else {
    store.dispatch(storeActions.updateIsScrollToTop(false))
  }
  if (store.getState().system.isMobile || isMobile) {
    const isBottom = event.target.scrollTop > 0 && (Math.round(event.target.scrollHeight) === Math.round(event.target.offsetHeight + event.target.scrollTop))
    if (isBottom && params.size < total) {
      setParams({
        ...params,
        page: 1,
        size: params.size + pageSize
      })
    }
  }
}

export const downloadCSV = (rows = []) => {
  let csvContent = 'data:text/csv;charset=utf-8,'
  rows.forEach(function(rowArray) {
    let row = rowArray.join(',')
    csvContent += row + '\r\n'
  })
  const encodedUri = encodeURI(csvContent)
  window.open(encodedUri)
}