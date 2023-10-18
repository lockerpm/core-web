import { FolderRequest } from '../../core-js/src/models/request';

import global from '../../config/global';

const getEncFolderForRequest = async (folder) => {
  const folderEnc = await global.jsCore.folderService.encrypt(folder)
  const data = new FolderRequest(folderEnc)
  return data
}

export default {
  getEncFolderForRequest
}