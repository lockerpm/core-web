import actionTypes from '../actionTypes'

const updateAllFolders = folders => {
  return {
    type: actionTypes.SET_ALL_FOLDERS,
    payload: folders,
  }
}

export default {
  updateAllFolders,
}