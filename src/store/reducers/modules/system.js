import actionTypes from '../../actionTypes'
import initial from '../../initial'

const system = (state = initial.system, action) => {
  switch (action.type) {
  case actionTypes.CHANGE_LANGUAGE:
    return { ...state, locale: action.payload }
  case actionTypes.TOGGLE_LOADING:
    return { ...state, isLoading: action.payload }
  case actionTypes.SET_CURRENT_PAGE:
    return { ...state, currentPage: action.payload }
  case actionTypes.SET_IS_MOBILE:
    return { ...state, isMobile: action.payload }
  case actionTypes.SET_IS_COLUMN:
    return { ...state, isColumn: action.payload }
  case actionTypes.SET_IS_SCROLL_TO_TOP:
    return { ...state, isScrollToTop: action.payload }
  case actionTypes.SET_COLLAPSED:
    return { ...state, collapsed: action.payload }
  case actionTypes.SET_SERVER_TYPE:
    return { ...state, serverType: action.payload }
  default:
    return state
  }
}

export default system
