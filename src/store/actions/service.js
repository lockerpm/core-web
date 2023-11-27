import actionTypes from '../actionTypes'

const updateIsReady = isReady => {
  return {
    type: actionTypes.SET_IS_READY,
    payload: isReady,
  }
}

const updateRequireDesktop = requireDesktop => {
  return {
    type: actionTypes.SET_REQUIRE_DESKTOP,
    payload: requireDesktop,
  }
}

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

const updatePairingConfirmed = pairingConfirmed => {
  return {
    type: actionTypes.SET_PAIRING_CONFIRMED,
    payload: pairingConfirmed,
  }
}

export default {
  updateIsReady,
  updateRequireDesktop,
  updateRequirePairing,
  updateIsConnected,
  updateApproveCode,
  updatePairingConfirmed,
}