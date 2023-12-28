import actionTypes from '../../actionTypes'
import initial from '../../initial'

const userInfo = (state = initial.auth, action) => {
  switch (action.type) {
  case actionTypes.SET_USER_INFO:
    return { ...state, userInfo: action.payload }
  case actionTypes.SET_FACTOR2:
    return { ...state, factor2: action.payload }
  case actionTypes.SET_SIGN_IN_RELOAD:
    return { ...state, signInReload: action.payload }
  default:
    return state
  }
}

export default userInfo
