import axios from 'axios'
import response from './response'
import common from './common'
// create an axios instance
const service = axios.create({
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    const deviceId = await common.getDeviceId();
    const accessToken = await common.getAccessToken() || ''
    const accessTokenType = await common.getAccessTokenType() || 'Bearer'

    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = `${accessTokenType} ${accessToken}`
    config.headers['CF-Access-Client-Id'] = process.env.REACT_APP_CF_ACCESS_CLIENT_ID
    config.headers['CF-Access-Client-Secret'] = process.env.REACT_APP_CF_ACCESS_CLIENT_SECRET
    config.headers['Device-Id'] = deviceId
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
    return Promise.reject(await response.handleResponseErrorMessage(error))
  }
)

export default service
