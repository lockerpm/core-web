import { useEffect, useState } from 'react'
import './client-service.scss'
import global from '../../config/global'
import storeActions from '../../store/actions'

import { useSelector } from 'react-redux'

let reconnect = null;

function ClientService() {
  const isConnected = useSelector((state) => state.service.isConnected);
  
  useEffect(() => {
    service.on('serviceReady', () => {
      global.store.dispatch(storeActions.updateIsReady(true))
    })
    service.on('requireDesktopOpen', () => {
      global.store.dispatch(storeActions.updateRequireDesktop(true))
    })
    service.on('requirePairing', () => {
      global.store.dispatch(storeActions.updateRequirePairing(true))
    })
    service.on('desktopConnected', () => {
      global.store.dispatch(storeActions.updateIsConnected(true));
    })
    service.on('desktopDisconnected', () => {
      global.store.dispatch(storeActions.updateIsConnected(false));
    })
    service.on('pairingConfirmation', (data) => {
      global.store.dispatch(storeActions.updateApproveCode(data.approveCode));
      global.store.dispatch(storeActions.updateClientId(data.clientId));
      global.store.dispatch(storeActions.updateClientType(data.clientType));
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
    service.on('userLogout', (data) => {
      // setMsg(`User ${data.email} just logout`)
    })
  }, [])

  useEffect(() => {
    if (!reconnect && !isConnected) {
      reconnect = setInterval(() => {
        service.resetSocket();
      }, 2000)
    }
    if (reconnect && isConnected) {
      clearInterval(reconnect)
      reconnect = null
    }
  }, [isConnected])

  return (
    <></>
  )
}

export default ClientService
