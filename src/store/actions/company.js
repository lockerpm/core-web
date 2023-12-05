import actionTypes from "../actionTypes"

const updateCompanyId = (id) => {
  return {
    type: actionTypes.SET_COMPANY_ID,
    payload: id,
  }
}

export default {
  updateCompanyId,
}
