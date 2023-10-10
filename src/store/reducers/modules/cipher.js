import actionTypes from '../../actionTypes'
import initial from '../../initial'

const cipher = (state = initial.cipher, action) => {
  switch (action.type) {
  case actionTypes.SET_ALL_CIPHERS:
    return { ...state, allCiphers: action.payload }
  default:
    return state
  }
}

export default cipher
