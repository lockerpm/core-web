import global from '../../config/global'
import storeActions from '../../store/actions'

import userServices from '../../services/user'
import authServices from '../../services/auth'
import sharingServices from '../../services/sharing'
import enterpriseServices from '../../services/enterprise'

import i18n from '../../config/i18n'
import common from '.'

const fetchUserInfo = async () => {
  await userServices.users_me().then(async (response) => {
    await global.jsCore.vaultTimeoutService.setVaultTimeoutOptions(response.timeout, response.timeout_action);
    global.store.dispatch(storeActions.updateUserInfo(response));
    global.store.dispatch(storeActions.changeLanguage(response.language || global.constants.LANGUAGE.EN));
    common.updateLanguage(response.language || global.constants.LANGUAGE.EN);
    i18n.changeLanguage(response.language || global.constants.LANGUAGE.EN);
  }).catch(async () => {
    await authServices.logout();
  })
}

const clearStoreData = async () => {
  await Promise.all([
    global.jsCore.cipherService.clear(),
    global.jsCore.folderService.clear(),
    global.jsCore.collectionService.clear(),
    global.jsCore.sendService.clear()
  ])
  global.store.dispatch(storeActions.updateAllCiphers([]))
  global.store.dispatch(storeActions.updateAllFolders([]))
  global.store.dispatch(storeActions.updateAllCollections([]))
  global.store.dispatch(storeActions.updateAllOrganizations([]))
  global.store.dispatch(storeActions.updateMyShares([]))
  global.store.dispatch(storeActions.updateInvitations([]))
  global.store.dispatch(storeActions.updateSends([]))
}

const getAllCollections = async () => {
  const result = await global.jsCore.collectionService.getAllDecrypted() || []
  const allCollections = result.filter(f => f.id).map((c) => ({ ...c, isCollection: true }))
  global.store.dispatch(storeActions.updateAllCollections(allCollections))
}

const getAllCiphers = async () => {
  const result = await global.jsCore.cipherService.getAllDecrypted() || []
  const allCiphers = result.map(item => {
    const i = common.parseNotesOfNewTypes(item)
    i.checked = false
    return i
  })
  global.store.dispatch(storeActions.updateAllCiphers(allCiphers))
}

const getAllFolders = async () => {
  const result = await global.jsCore.folderService.getAllDecrypted() || []
  const allFolders = result.filter(f => f.id)
  global.store.dispatch(storeActions.updateAllFolders(allFolders))
}

const getSends = async () => {
  const sends = await global.jsCore.sendService.getAllDecrypted() || []
  const allCiphers = global.store.getState().cipher.allCiphers
  global.store.dispatch(storeActions.updateSends(sends.map((s) => {
    const cipher = allCiphers.find(c => c.id === s.cipherId)
    return { ...s, name: cipher?.name, cipher: cipher }
  })))
}

const getMyShares = async () => {
  const myShares = await sharingServices.list_my_shares();
  await global.store.dispatch(storeActions.updateMyShares(myShares))
}

const getInvitations = async () => {
  const invitations = await sharingServices.list_invitations();
  await global.store.dispatch(storeActions.updateInvitations(invitations))
}

const getTeams = async () => {
  const teams = await enterpriseServices.list_teams({ paging: 0 });
  await global.store.dispatch(storeActions.updateTeams(teams))
}

export default {
  fetchUserInfo,
  clearStoreData,
  getAllCollections,
  getAllCiphers,
  getAllFolders,
  getSends,
  getMyShares,
  getInvitations,
  getTeams,
}
