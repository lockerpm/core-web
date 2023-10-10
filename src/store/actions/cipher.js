import actionTypes from '../actionTypes'

const updateAllCiphers = ciphers => {
  return {
    type: actionTypes.SET_ALL_CIPHERS,
    payload: ciphers,
  }
}

export default {
  updateAllCiphers,
}