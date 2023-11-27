import { useEffect, useState } from 'react'
import './client-service.scss'
import global from '../../config/global'
import storeActions from '../../store/actions'

import { useSelector } from 'react-redux'

function ClientService() {
  const isReady = useSelector((state) => state.service.isReady);
  const isConnected = useSelector((state) => state.service.isConnected);
  const approveCode = useSelector((state) => state.service.approveCode);
  
  const [msg, setMsg] = useState('')

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
      global.store.dispatch(storeActions.updateIsReady(service.isReady))
    })
    service.on('desktopDisconnected', () => {
      global.store.dispatch(storeActions.updateIsConnected(false));
    })
    service.on('pairingConfirmation', (data) => {
      global.store.dispatch(storeActions.updateApproveCode(data.approveCode));
    })
    service.on('pairingConfirmed', () => {
      global.store.dispatch(storeActions.updatePairingConfirmed(true));
    })
    service.on('userLogin', (data) => {
      setMsg(`User ${data.email} just login`)
    })
    service.on('userLogout', (data) => {
      setMsg(`User ${data.email} just logout`)
    })
  }, [])

  useEffect(() => {
    setInterval(async () => {
      if (!isConnected) {
        // await service.resetSocket();
      }
    }, 2000);
  }, [isConnected])

  const loadCurrentUser = async () => {
    try {
      const user = await service.getCurrentUser();
      console.log(user);
    } catch (error) {
      setMsg('pls open desktop')
    }
  }

  return (
    <>
     {/* {
       !isReady && <div className="client-service">
          <div>
            <h1>Service status: {isReady ? 'Ready' : 'Not Ready'}</h1>
            <h1>Desktop status: {isConnected ? 'Connected' : 'Not Connected'}</h1>
            <h2 style={{ color: 'red' }}>Error: {msg}</h2>
            <h3>Approve code: {approveCode}</h3>
          </div>
        </div>
      } */}
    </>
    
  )
}

export default ClientService
