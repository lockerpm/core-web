import { WebService, StorageService } from 'locker-client-service'

class WebStorageService implements StorageService {
  secureStorage: {
    [key: string]: any
  }

  constructor() {
    this.secureStorage = {}
  }

  get(key: string) {
    try {
      return Promise.resolve(JSON.parse(sessionStorage.getItem(key) || '') || null)
    } catch (error) {
      return Promise.resolve(null)
    }
  }
  set(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data))
    return Promise.resolve()
  }
  delete(key: string) {
    sessionStorage.removeItem(key)
    return Promise.resolve()
  }

  getSecure(key: string) {
    try {
      return Promise.resolve(JSON.parse(sessionStorage.getItem(`secure___${key}`) || '') || null)
    } catch (error) {
      return Promise.resolve(null)
    }
  }
  setSecure(key: string, data: any) {
    sessionStorage.setItem(`secure___${key}`, JSON.stringify(data))
    return Promise.resolve()
  }
  deleteSecure(key: string) {
    sessionStorage.removeItem(`secure___${key}`)
    return Promise.resolve()
  }
}

const webStorageService = new WebStorageService()

const service = new WebService({
  storageService: webStorageService,
  logLevel: 1,
  baseApiUrl: `${process.env.REACT_APP_API_URL}/v3`,
  clientType: 'web',
  servicePorts: [14411, 14110, 15611, 14412, 16311, 14514, 14515, 14413, 16310],
})

export { service }
