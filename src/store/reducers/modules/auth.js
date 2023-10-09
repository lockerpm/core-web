import actionTypes from '../../actionTypes'
import initial from '../../initial'

const userInfo = (state = initial.auth, action) => {
  switch (action.type) {
  case actionTypes.SET_USER_INFO:
    return { ...state, userInfo: action.payload }
  case actionTypes.SET_USERS_ME:
    return { ...state, usersMe: action.payload }
  case actionTypes.SET_FACTOR2:
    return { ...state, factor2: action.payload }
  default:
    return state
  }
}

export default userInfo
