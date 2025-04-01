import storage from './storage'
import other from './other'
import data from './data'
import format from './format'
import time from './time'
import router from './router'
import cipher from './cipher'
import otp from './otp'
import folder from './folder'
import permission from'./permission'
import share from './share'
import store from './store'
import sync from './sync'
import socket from './socket'
import auth from './auth'
import policy from './policy'
import attachment from './attachment'

export default {
  ...storage,
  ...other,
  ...data,
  ...format,
  ...time,
  ...router,
  ...cipher,
  ...otp,
  ...folder,
  ...permission,
  ...share,
  ...store,
  ...sync,
  ...socket,
  ...auth,
  ...policy,
  ...attachment
}