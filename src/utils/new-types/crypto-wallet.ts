import { View } from "../../core-js/src/models/view"

export class CryptoWalletData {
  walletApp: {
    name: string
    alias: string
  }
  username: string
  password: string
  pin: string
  address: string
  privateKey: string
  seed: string
  networks: {
    name: string
    alias: string
  }[]
  notes: string
  constructor(c?: any) {
    if (!c) {
      return
    }
    this.walletApp = c.walletApp || {
      name: null,
      alias: null
    }
    this.username = c.username || ''
    this.password = c.password || ''
    this.pin = c.pin || ''
    this.address = c.address || ''
    this.privateKey = c.privateKey || ''
    this.seed = c.seed || ''
    this.networks = c.networks || []
    this.notes = c.notes || ''
  }
}

const toCryptoWalletData = (str: string) => {
  let res: CryptoWalletData = new CryptoWalletData()
  try {
    const parsed: CryptoWalletData = JSON.parse(str)
    res = {
      ...res,
      ...parsed
    }
  } catch (e) {}
  return res
}

export default {
  toCryptoWalletData
}