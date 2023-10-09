import axios from 'axios'
import { handleResponseErrorMessage } from './response'
import authServices from '../services/auth'
// create an axios instance
const service = axios.create({
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const accessToken = authServices.access_token() || ''
    const accessTokenType = authServices.access_token_type() || 'Bearer'
    config.headers['Content-Type'] = 'multipart/form-data'
    config.headers['Authorization'] = `${accessTokenType} ${accessToken}`
    config.headers['CF-Access-Client-Id'] = process.env.REACT_APP_CLIENT_ID
    config.headers['CF-Access-Client-Secret'] = process.env.REACT_APP_CLIENT_SECRET
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  async error => {
    return Promise.reject(await handleResponseErrorMessage(error))
  }
)

export default service
