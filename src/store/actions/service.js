import actionTypes from '../actionTypes'

const updateRequirePairing = requirePairing => {
  return {
    type: actionTypes.SET_REQUIRE_PAIRING,
    payload: requirePairing,
  }
}

const updateIsConnected = isConnected => {
  return {
    type: actionTypes.SET_IS_CONNECTED,
    payload: isConnected,
  }
}

const updateApproveCode = approveCode => {
  return {
    type: actionTypes.SET_APPROVE_CODE,
    payload: approveCode,
  }
}

const updateClientId = clientId => {
  return {
    type: actionTypes.SET_CLIENT_ID,
    payload: clientId,
  }
}

const updateClientType = clientType => {
  return {
    type: actionTypes.SET_CLIENT_TYPE,
    payload: clientType,
  }
}

const updatePairingConfirmed = pairingConfirmed => {
  return {
    type: actionTypes.SET_PAIRING_CONFIRMED,
    payload: pairingConfirmed,
  }
}

const updateIsTouch = isTouch => {
  return {
    type: actionTypes.SET_IS_TOUCH,
    payload: isTouch,
  }
}

const updateIsFingerprint = isFingerprint => {
  return {
    type: actionTypes.SET_IS_FINGERPRINT,
    payload: isFingerprint,
  }
}

const updateIsDesktopConnected = isDesktopConnected => {
  return {
    type: actionTypes.SET_IS_DESKTOP_CONNECTED,
    payload: isDesktopConnected,
  }
}

export default {
  updateRequirePairing,
  updateIsConnected,
  updateApproveCode,
  updateClientId,
  updateClientType,
  updatePairingConfirmed,
  updateIsTouch,
  updateIsFingerprint,
  updateIsDesktopConnected,
}