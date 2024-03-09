import userServices from "../../services/user";
import commonServices from "../../services/common";
import coreServices from "../../services/core";

import global from "../../config/global";
import storage from "./storage";
import store from "./store";

const unlockToVault = async (
  payload,
  query = null,
  callback = () => { }
) => {
  const request =  payload?.is_otp ? userServices.users_session_otp(payload) : userServices.users_session(payload)
  delete payload.is_otp
  await request.then(async (response) => {
    if (response.is_factor2) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.OTP_CODE, {}, query || {})
    } else if (!response.is_factor2 && response.token) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.SETUP_2FA, {}, query || {})
    } else {
      storage.updateAccessTokenType(response.token_type)
      storage.updateAccessToken(response.access_token);
      storage.updateUnlockMethod(payload.unlock_method);
      await store.fetchUserInfo();
      await coreServices.unlock({ ...response, ...payload });
      await commonServices.sync_data();
      if (payload.sync_all_platforms) {
        await commonServices.service_login(payload);
      }
      if (query) {
        callback();
      } else {
        global.navigate(global.keys.VAULT);
      }
    }
  }).catch((error) => {
    global.pushError(error)
  })
}

export default {
  unlockToVault
}

