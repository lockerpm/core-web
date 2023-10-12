import actionTypes from '../actionTypes'

const updateAllCollections = collections => {
  return {
    type: actionTypes.SET_ALL_COLLECTIONS,
    payload: collections,
  }
}

export default {
  updateAllCollections,
}