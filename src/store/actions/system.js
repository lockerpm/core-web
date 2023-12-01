import actionTypes from '../actionTypes'
import systemService from '../../services/system'

const changeLanguage = lang => {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    payload: lang,
  }
}

const toggleLoading = (isLoading = false) => {
  return {
    type: actionTypes.TOGGLE_LOADING,
    payload: isLoading,
  }
}

const updateCurrentPage = page => {
  return {
    type: actionTypes.SET_CURRENT_PAGE,
    payload: page,
  }
}

const updateIsMobile = data => {
  return {
    type: actionTypes.SET_IS_MOBILE,
    payload: data,
  }
}

const updateIsColumn = data => {
  return {
    type: actionTypes.SET_IS_COLUMN,
    payload: data,
  }
}

const updateIsScrollToTop = data => {
  return {
    type: actionTypes.SET_IS_SCROLL_TO_TOP,
    payload: data,
  }
}

const updateCollapsed = data => {
  return {
    type: actionTypes.SET_COLLAPSED,
    payload: data,
  }
}

const updateServerType = data => {
  return {
    type: actionTypes.SET_SERVER_TYPE,
    payload: data,
  }
}


const updateIsCloud = data => {
  return {
    type: actionTypes.SET_IS_CLOUD,
    payload: data,
  }
}

const updateCacheData = data => {
  systemService.update_cache(data)
  return {
    type: actionTypes.SET_CACHE_DATA,
    payload: data,
  }
}

const updateIsDesktop = data => {
  return {
    type: actionTypes.SET_IS_DESKTOP,
    payload: data,
  }
}

export default {
  changeLanguage,
  toggleLoading,
  updateCurrentPage,
  updateIsMobile,
  updateIsColumn,
  updateIsScrollToTop,
  updateCollapsed,
  updateServerType,
  updateIsCloud,
  updateCacheData,
  updateIsDesktop
}