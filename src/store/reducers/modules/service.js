import actionTypes from '../../actionTypes'
import initial from '../../initial'

const service = (state = initial.service, action) => {
  switch (action.type) {
  case actionTypes.SET_IS_READY:
    return { ...state, isReady: action.payload }
    case actionTypes.SET_REQUIRE_DESKTOP:
  return { ...state, requireDesktop: action.payload }
      case actionTypes.SET_REQUIRE_PAIRING:
  return { ...state, requirePairing: action.payload }
    case actionTypes.SET_IS_CONNECTED:
  return { ...state, isConnected: action.payload }
    case actionTypes.SET_APPROVE_CODE:
  return { ...state, approveCode: action.payload }
  case actionTypes.SET_CLIENT_ID:
    return { ...state, clientId: action.payload }
  case actionTypes.SET_CLIENT_TYPE:
    return { ...state, clientType: action.payload }
  case actionTypes.SET_PAIRING_CONFIRMED:
    return { ...state, pairingConfirmed: action.payload }
  case actionTypes.SET_IS_TOUCH:
    return { ...state, isTouch: action.payload }
  case actionTypes.SET_IS_FINGERPRINT:
    return { ...state, isFingerprint: action.payload }
  default:
    return state
  }
}

export default service
