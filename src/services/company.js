import request from "../utils/request"
import global from "../config/global"

function list() {
  return request({
    url: global.endpoint.COMPANIES,
    method: "get",
  })
}

function create(data = {}) {
  return request({
    url: global.endpoint.COMPANIES,
    method: "post",
    data,
  })
}

function update(id, data = {}) {
  return request({
    url: global.endpoint.COMPANY.replace(":id", id),
    method: "put",
    data
  })
}

function remove(id) {
  return request({
    url: global.endpoint.COMPANY.replace(":id", id),
    method: "delete",
  })
}

export default {
  list,
  create,
  update,
  remove
}
