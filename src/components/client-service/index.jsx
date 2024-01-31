import { useEffect, useState } from 'react'
import './client-service.scss'
import global from '../../config/global'
import storeActions from '../../store/actions'

import authServices from '../../services/auth'

import { useSelector } from 'react-redux';

let resetConnectionInterval = null
let connectSocketInterval = null

function ClientService() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isConnected = useSelector((state) => state.service.isConnected);
  const isDesktopConnected = useSelector((state) => state.service.isDesktopConnected);

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
  service.on('userLogin', (data) => {
    // setMsg(`User ${data.email} just login`)
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
      clearInterval(resetConnectionInterval);
      resetConnectionInterval = null;
    } else {
      resetConnectionInterval = setInterval(async () => {
        await service.grpcService?.resetConnection()
      }, 10000)
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      if (isDesktopConnected) {
        clearInterval(connectSocketInterval);
        connectSocketInterval = null;
      } else {
        connectSocketInterval = setInterval(async () => {
          await service.socketService?.connectSocket()
        }, 10000)
      }
    } else {
      clearInterval(connectSocketInterval);
    }
  }, [isDesktopConnected, isConnected])

  return (
    <></>
  )
}

export default ClientService
