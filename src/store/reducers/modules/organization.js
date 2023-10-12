import actionTypes from '../../actionTypes'
import initial from '../../initial'

const organization = (state = initial.organization, action) => {
  switch (action.type) {
  case actionTypes.SET_ALL_ORGANIZATIONS:
    return { ...state, allOrganizations: action.payload }
  default:
    return state
  }
}

export default organization
