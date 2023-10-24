import actionTypes from '../actionTypes'

const updateTeams = teams => {
  return {
    type: actionTypes.SET_TEAMS,
    payload: teams,
  }
}

export default {
  updateTeams,
}