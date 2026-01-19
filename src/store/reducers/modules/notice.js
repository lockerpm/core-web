import actionTypes from '../../actionTypes'
import initial from '../../initial'

const notice = (state = initial.notice, action) => {
  switch (action.type) {
  case actionTypes.SET_CONFIRM_MY_SHARE_VISIBLE:
    return { ...state, confirmMyShareVisible: action.payload }
  default:
    return state
  }
}

export default notice
