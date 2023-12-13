import actionTypes from '../actionTypes'

const updateTeams = teams => {
  return {
    type: actionTypes.SET_TEAMS,
    payload: teams,
  }
}

const updateCurrentEnterprise = currentEnterprise => {
  return {
    type: actionTypes.SET_CURRENT_ENTERPRISE,
    payload: currentEnterprise,
  }
}

export default {
  updateTeams,
  updateCurrentEnterprise
}