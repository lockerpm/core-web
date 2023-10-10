import actionTypes from '../../actionTypes'
import initial from '../../initial'

const sync = (state = initial.sync, action) => {
  switch (action.type) {
  case actionTypes.SET_IS_LOCKED:
    return { ...state, isLocked: action.payload }
  case actionTypes.SET_IS_SYNC:
    return { ...state, isSync: action.payload }
  case actionTypes.SET_SYNCING:
    return { ...state, syncing: action.payload }
  case actionTypes.SET_SYNC_PROFILE:
    return { ...state, syncProfile: action.payload }
  default:
    return state
  }
}

export default sync
