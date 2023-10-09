import systemService from '../services/system'

export default {
  system: {
    locale: 'en',
    isLoading: false,
    currentPage: {},
    isMobile: false,
    isColumn: true,
    isScrollToTop: false,
    collapsed: false,
    isCloud: false,
    cacheData: systemService.get_cache()
  },
  auth: {
    userInfo: null,
    factor2: null,
    loginInfo: null
  },
  core: {
    isLocked: true,
    isSync: false,
    syncing: false
  }
}