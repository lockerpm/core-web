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

const updateSends = sends => {
  return {
    type: actionTypes.SET_SENDS,
    payload: sends,
  }
}

export default {
  updateMyShares,
  updateInvitations,
  updateSends
}