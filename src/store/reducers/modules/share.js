import actionTypes from '../../actionTypes'
import initial from '../../initial'

const share = (state = initial.share, action) => {
  switch (action.type) {
  case actionTypes.SET_MY_SHARES:
    return { ...state, myShares: action.payload }
  case actionTypes.SET_INVITATIONS:
    return { ...state, invitations: action.payload }
  case actionTypes.SET_SENDS:
    return { ...state, sends: action.payload }
  default:
    return state
  }
}

export default share
