import userServices from "../../services/user";
import commonServices from "../../services/common";
import coreServices from "../../services/core";

import global from "../../config/global";

import common from ".";
import storeActions from "../../store/actions";

const serviceSetApiToken = async () => {
  if (!service) return;
  const accessToken = await common.getAccessToken();
  await service.setApiToken(accessToken);
  const sessionToken = await common.getSessionToken();
  await service.setApiSessionToken(sessionToken);
}

const updateToken = async (response) => {
  const accessTokenType = response?.token_type || 'Bearer';
  const accessToken = response?.access_token || response?.token || null;
  const sessionToken = response?.session_token || accessToken;
  await common.updateAccessTokenType(accessTokenType);
  await common.updateAccessToken(accessToken);
  await common.updateSessionToken(sessionToken);
}

const remakeBackupPWL = async (payload) => {
  const userInfo = global.store.getState().auth.userInfo;
  if (payload.pwl_id && userInfo) {
    if (
      payload.kdf !== userInfo.kdf ||
      payload.kdf_iterations !== userInfo.kdf_iterations ||
      payload.kdf_memory !== userInfo.kdf_memory ||
      payload.kdf_parallelism !== userInfo.kdf_parallelism
    ) {
      await serviceSetApiToken();
      const encKey = await global.jsCore.cryptoService.getEncKey();
      const currentMasterPasswordHash = await global.jsCore.cryptoService.getKeyHash();
      let remakeResponse = null;
      if (payload.unlock_method === 'security_key') {
        remakeResponse = await service.remakeBackupPasswordless({
          id: payload.pwl_id,
          email: userInfo.email,
          currentEncKey: encKey.key,
          currentMasterPasswordHash,
          secret: payload.password,
          kdf: userInfo.kdf,
          kdfIterations: userInfo.kdf_iterations,
          kdfMemory: userInfo.kdf_memory,
          kdfParallelism: userInfo.kdf_parallelism
        })
      } else if (payload.unlock_method === 'passkey') {
        remakeResponse = await service.remakeBackupPasswordlessUsingPasskey({
          id: payload.pwl_id,
          email: userInfo.email,
          currentEncKey: encKey.key,
          currentMasterPasswordHash,
          secret: payload.password,
          kdf: userInfo.kdf,
          kdfIterations: userInfo.kdf_iterations,
          kdfMemory: userInfo.kdf_memory,
          kdfParallelism: userInfo.kdf_parallelism
        })
      }
      if (remakeResponse) {
        await coreServices.logout();
        return remakeResponse;
      }
    }
  }
  return null;
}

const unlockToVault = async (
  payload,
  query = null,
  callback = () => { }
) => {
  const request = payload?.is_otp ? userServices.users_session_otp(payload) : userServices.users_session(payload);
  const isOtp = payload.is_otp || false;
  delete payload.is_otp
  await request.then(async (response) => {
    if (response.is_factor2) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.OTP_CODE, {}, query || {})
    } else if (!response.is_factor2 && response.token) {
      global.store.dispatch(storeActions.updateFactor2({ ...response, ...payload }));
      global.navigate(global.keys.SETUP_2FA, {}, query || {})
    } else {
      await updateToken(response);
      await common.updateUnlockMethod(payload.unlock_method);
      await common.fetchUserInfo();
      await coreServices.unlock({
        ...response,
        ...payload
      });
      const remakeResponse = await remakeBackupPWL(payload);
      if (remakeResponse) {
        const newPayload = {
          ...payload,
          is_otp: isOtp,
          password: null,
          hashedPassword: remakeResponse.hashedPassword,
          keyB64: remakeResponse.key.keyB64,
          kdf: remakeResponse.kdf,
          kdf_iterations: remakeResponse.kdf_iterations,
          kdf_memory: remakeResponse.kdf_memory,
          kdf_parallelism: remakeResponse.kdf_parallelism
        }
        await unlockToVault(newPayload, query, callback)
      } else {
        const isSynced = await commonServices.sync_data();
        if (isSynced) {
          if (query) {
            callback();
          } else {
            global.navigate(global.keys.VAULT);
          }
        }
      }
    }
  }).catch((error) => {
    global.pushError(error)
  })
}

export default {
  serviceSetApiToken,
  updateToken,
  unlockToVault,
  remakeBackupPWL
}

