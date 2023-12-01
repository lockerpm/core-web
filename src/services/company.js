import request from "../utils/request"
import global from "../config/global"

function get_companies() {
  return request({
    url: global.endpoint.COMPANIES,
    method: "get",
  })
}

function create_company(data = {}) {
  return request({
    url: global.endpoint.COMPANIES,
    method: "post",
    data,
  })
}

function get_company_by_id(id) {
  return request({
    url: global.endpoint.COMPANY.replace(":id", id),
    method: "get",
  })
}

export default {
  get_companies,
  create_company,
  get_company_by_id,
}
