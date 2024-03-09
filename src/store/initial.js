export default {
  system: {
    locale: "en",
    isLoading: false,
    currentPage: {},
    isMobile: false,
    isColumn: true,
    isScrollToTop: false,
    collapsed: false,
    serverType: null,
  },
  auth: {
    userInfo: null,
    factor2: null,
    signInReload: false
  },
  sync: {
    isLocked: true,
    isSync: false,
    syncing: false,
    syncProfile: null,
  },
  share: {
    myShares: [],
    invitations: [],
    sends: [],
  },
  cipher: {
    allCiphers: [],
  },
  organization: {
    allOrganizations: [],
  },
  folder: {
    allFolders: [],
  },
  collection: {
    allCollections: [],
  },
  enterprise: {
    teams: [],
    currentEnterprise: null
  },
  service: {
    requirePairing: false,
    isConnected: false,
    isDesktopConnected: false,
    approveCode: null,
    clientId: null,
    clientType: null,
    pairingConfirmed: false,
  }
}
