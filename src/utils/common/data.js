import dayjs from 'dayjs'
import storeActions from '../../store/actions/index'
import global from '../../config/global'

const paginationAndSortData = (
  allData,
  params,
  sortBy = 'revisionDate',
  sortType = 'desc',
  filters = []
) => {
  let filteredData = allData
  filters.forEach(f => {
    filteredData = filteredData.filter(d => f(d))
  })
  filteredData = filteredData.sort((d1, d2) => {
    let a = d1[sortBy], b = d2[sortBy]
    if (!a) {
      return 0
    }
    if (a instanceof Date) {
      a = dayjs(new Date(a)).unix()
      b = dayjs(new Date(b)).unix()
    }
    if (typeof a === 'string') {
      a = a?.toLowerCase() || ''
      b = b?.toLowerCase() || ''
    }
    if (sortType === 'asc') {
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

function scrollEnd(
  event,
  params,
  total,
  setParams,
  isMobile = false,
  pageSize = global.constants.PAGE_SIZE
) {
  if (event.target.scrollTop > 100) {
    global.store.dispatch(storeActions.updateIsScrollToTop(true))
  } else {
    global.store.dispatch(storeActions.updateIsScrollToTop(false))
  }
  if (global.store.getState().system.isMobile || isMobile) {
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

const downloadCSV = (rows = []) => {
  let csvContent = 'data:text/csv;charset=utf-8,'
  rows.forEach(function(rowArray) {
    let row = rowArray.join(',')
    csvContent += row + '\r\n'
  })
  const encodedUri = encodeURI(csvContent)
  window.open(encodedUri)
}

export default {
  paginationAndSortData,
  scrollEnd,
  downloadCSV
}