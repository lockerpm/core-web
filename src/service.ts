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
    // Web client should only keep in memory
    // return Promise.resolve(this.secureStorage[key] || null);
    try {
      return Promise.resolve(JSON.parse(sessionStorage.getItem(`secure___${key}`) || '') || null)
    } catch (error) {
      return Promise.resolve(null)
    }
  }
  setSecure(key: string, data: any) {
    // Web client should only keep in memory
    // this.secureStorage[key] = data;
    sessionStorage.setItem(`secure___${key}`, JSON.stringify(data))
    return Promise.resolve()
  }
  deleteSecure(key: string) {
    // Web client should only keep in memory
    // this.secureStorage[key] = undefined;
    sessionStorage.removeItem(`secure___${key}`)
    return Promise.resolve()
  }
}

const webStorageService = new WebStorageService()

const service = new WebService({
  storageService: webStorageService,
  logLevel: 2,
  baseApiUrl: process.env.REACT_APP_API_URL,
  clientType: 'web',
})

export { service }
