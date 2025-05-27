import global from "../../config/global";
import commonServices from "../../services/common";
import storeActions from '../../store/actions';
import syncServices from "../../services/sync";

import common from ".";

const syncDataByWs = async (message) => {
  const eventType = message.type;
  global.store.dispatch(storeActions.updateSyncing(true))

  if (['cipher_share', 'collection_update', 'cipher_invitation'].includes(eventType)) {
    await commonServices.sync_data();
  } else if (eventType.includes('cipher')) {
    if (['cipher_update', 'cipher_delete', 'cipher_restore'].includes(eventType)) {
      await common.syncProfile();
      if (message.data.id) {
        await common.syncItems([message.data.id])
      }
      if (message.data.ids) {
        await common.syncItems(message.data.ids)
      }
      await common.getInvitations();
    } else if (eventType.includes('cipher_delete_permanent')) {
      await global.jsCore.cipherService.delete(message.data.ids);
      await common.getAllCiphers();
    } else {
      await commonServices.sync_data();
    }
  } else if (eventType.includes('folder')) {
    if (eventType.includes('update')) {
      const res = await syncServices.sync_folder(message.data.id);
      await global.jsCore.folderService.upsert([res])
      await common.getAllFolders();
    } else if (eventType.includes('delete')) {
      await global.jsCore.folderService.delete(message.data.ids);
      await common.getAllFolders();
    } else {
      await commonServices.sync_data();
    }
  } else if (eventType.includes('collection')) {
    if (eventType.includes('update')) {
      if (message.data.id) {
        const res = await syncServices.sync_collection(message.data.id);
        await global.jsCore.collectionService.upsert([res])
        await common.getAllCollections();
      }
    } else if (eventType.includes('delete')) {
      await global.jsCore.collectionService.delete(message.data.ids);
      await common.getAllCollections();
    } else {
      await commonServices.sync_data();
    }
  } else if (eventType.includes('enterprise_policy_update')) {
    await common.syncPolicies()
  } else {
    await commonServices.sync_data();
  }

  global.store.dispatch(storeActions.updateSyncing(false))
}

export default {
  syncDataByWs
}