import actionTypes from '../../actionTypes'
import initial from '../../initial'

const enterprise = (state = initial.enterprise, action) => {
  switch (action.type) {
  case actionTypes.SET_TEAMS:
    return { ...state, teams: action.payload }
  default:
    return state
  }
}

export default enterprise
