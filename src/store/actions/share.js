import actionTypes from '../actionTypes'

const updateMyShares = myShares => {
  return {
    type: actionTypes.SET_MY_SHARES,
    payload: myShares,
  }
}

const updateInvitations = invitations => {
  return {
    type: actionTypes.SET_INVITATIONS,
    payload: invitations,
  }
}

export default {
  updateMyShares,
  updateInvitations
}