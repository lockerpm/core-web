import actionTypes from '../../actionTypes'
import initial from '../../initial'

const core = (state = initial.core, action) => {
  switch (action.type) {
  case actionTypes.SET_IS_LOCKED:
    return { ...state, isLocked: action.payload }
  case actionTypes.SET_IS_SYNC:
    return { ...state, isSync: action.payload }
  case actionTypes.SET_SYNCING:
    return { ...state, syncing: action.payload }
  default:
    return state
  }
}

export default core
