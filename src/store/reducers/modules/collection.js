import actionTypes from '../../actionTypes'
import initial from '../../initial'

const collection = (state = initial.collection, action) => {
  switch (action.type) {
  case actionTypes.SET_ALL_COLLECTIONS:
    return { ...state, allCollections: action.payload }
  default:
    return state
  }
}

export default collection
