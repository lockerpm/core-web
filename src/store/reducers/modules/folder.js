import actionTypes from '../../actionTypes'
import initial from '../../initial'

const folder = (state = initial.folder, action) => {
  switch (action.type) {
  case actionTypes.SET_ALL_FOLDERS:
    return { ...state, allFolders: action.payload }
  default:
    return state
  }
}

export default folder
