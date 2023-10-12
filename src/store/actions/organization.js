import actionTypes from '../actionTypes'

const updateAllOrganizations = organizations => {
  return {
    type: actionTypes.SET_ALL_ORGANIZATIONS,
    payload: organizations,
  }
}

export default {
  updateAllOrganizations,
}