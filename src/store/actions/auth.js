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

const updateSignInReload = isReload => {
  return {
    type: actionTypes.SET_SIGN_IN_RELOAD,
    payload: isReload,
  }
}

export default {
  updateUserInfo,
  updateFactor2,
  updateSignInReload
}