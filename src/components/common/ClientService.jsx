import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import storeActions from '../../store/actions'
import authServices from '../../services/auth'

import global from '../../config/global'

function ClientService() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isConnected = useSelector((state) => state.service.isConnected);

  service.on('serviceReady', () => {
    global.store.dispatch(storeActions.updateIsConnected(service.grpcService?.isReady));
  })
  service.on('serviceConnected', () => {
    global.store.dispatch(storeActions.updateIsConnected(true));
  })
  service.on('serviceDisconnected', () => {
    global.store.dispatch(storeActions.updateIsConnected(false));
  })
  service.on('requirePairing', () => {
    global.store.dispatch(storeActions.updateRequirePairing(true))
  })
  service.on('desktopConnected', () => {
    global.store.dispatch(storeActions.updateIsDesktopConnected(true));
  })
  service.on('desktopDisconnected', () => {
    global.store.dispatch(storeActions.updateIsDesktopConnected(false));
  })
  service.on('pairingConfirmation', (data) => {
    global.store.dispatch(storeActions.updateApproveCode(data.approveCode));
    global.store.dispatch(storeActions.updateClientId(data.clientId));
    global.store.dispatch(storeActions.updateClientType(data.clientType));
    global.store.dispatch(storeActions.updatePairingConfirmed(false));
  })
  service.on('pairingConfirmed', () => {
    global.store.dispatch(storeActions.updatePairingConfirmed(true));
  })
  service.on('fidoRequestTouch', () => {
    global.store.dispatch(storeActions.updateIsTouch(true));
  })
  service.on('fidoRequestFingerprint', () => {
    global.store.dispatch(storeActions.updateIsFingerprint(true));
  })
  service.on('userLock', async (data) => {
    if (data.email === userInfo?.email && userInfo?.sync_all_platforms) {
      authServices.redirect_login();
    }
  })
  service.on('userLogout', async (data) => {
    if (data.email === userInfo?.email && userInfo?.sync_all_platforms) {
      await service.logout();
      authServices.logout();
    }
  })

  useEffect(() => {
    if (isConnected) {
      getCacheData();
      setInterval(() => {
        getCacheData();
      }, 5 * 1000);
    } else {
      global.store.dispatch(storeActions.updateCacheData({}))
    }
  }, [isConnected])

  const getCacheData = () => {
    service.getCacheData().then((res) => {
      global.store.dispatch(storeActions.updateCacheData(res))
    }).catch(() => {
      global.store.dispatch(storeActions.updateCacheData({}))
      service.resetBackgroundService();
    })
  }

  return (
    <></>
  )
}

export default ClientService
