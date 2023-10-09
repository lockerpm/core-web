import actionTypes from '../actionTypes'

const updateUserInfo = userInfo => {
  return {
    type: actionTypes.SET_USER_INFO,
    payload: userInfo,
  }
}

const updateUsersMe = usersMe => {
  return {
    type: actionTypes.SET_USERS_ME,
    payload: usersMe,
  }
}

const updateFactor2 = factor2 => {
  return {
    type: actionTypes.SET_FACTOR2,
    payload: factor2,
  }
}

export default {
  updateUserInfo,
  updateUsersMe,
  updateFactor2,
}