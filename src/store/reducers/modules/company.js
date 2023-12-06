import actionTypes from "../../actionTypes"
import initial from "../../initial"

const company = (state = initial.company, action) => {
  switch (action.type) {
    case actionTypes.SET_COMPANY_ID:
      return { ...state, id: action.payload }
    default:
      return state
  }
}

export default company
