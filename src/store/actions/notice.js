import actionTypes from '../actionTypes'

const updateConfirmMyShareVisible = visible => {
  return {
    type: actionTypes.SET_CONFIRM_MY_SHARE_VISIBLE,
    payload: visible,
  }
}

export default {
  updateConfirmMyShareVisible,
}