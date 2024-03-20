import actionTypes from '../actionTypes'

const updateIsLocked = locked => {
  return {
    type: actionTypes.SET_IS_LOCKED,
    payload: locked,
  }
}

const updateIsSync = isSync => {
  return {
    type: actionTypes.SET_IS_SYNC,
    payload: isSync,
  }
}

const updateSyncing = syncing => {
  return {
    type: actionTypes.SET_SYNCING,
    payload: syncing,
  }
}

const updateSyncProfile = profile => {
  return {
    type: actionTypes.SET_SYNC_PROFILE,
    payload: profile,
  }
}

const updateSyncPolicies = policies => {
  return {
    type: actionTypes.SET_SYNC_POLICIES,
    payload: policies,
  }
}

export default {
  updateIsLocked,
  updateIsSync,
  updateSyncing,
  updateSyncProfile,
  updateSyncPolicies
}