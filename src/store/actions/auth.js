import actionTypes from '../actionTypes'

const updateUserInfo = userInfo => {
  return {
    type: actionTypes.SET_USER_INFO,
    payload: userInfo,
  }
}

const updateFactor2 = factor2 => {
  return {
    type: actionTypes.SET_FACTOR2,
    payload: factor2,
  }
}

const updateLoginInfo = loginInfo => {
  return {
    type: actionTypes.SET_LOGIN_INFO,
    payload: loginInfo,
  }
}

export default {
  updateUserInfo,
  updateFactor2,
  updateLoginInfo
}